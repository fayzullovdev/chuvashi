from flask import Flask, render_template, request, jsonify, redirect, url_for, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from datetime import datetime
import os
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import collections.abc
import collections
# Python 3.10+ compatibility fix for python-valve
if not hasattr(collections, 'Mapping'):
    collections.Mapping = collections.abc.Mapping
if not hasattr(collections, 'Sequence'):
    collections.Sequence = collections.abc.Sequence

from valve.source.a2s import ServerQuerier
import socket


app = Flask(__name__, static_folder='static', template_folder='templates')
# STABLE SECRET KEY to prevent session loss on restart
app.config['SECRET_KEY'] = 'f_gaming_secret_key_2026_secure_v1'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///f_gaming.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Email Settings (Using placeholders, user should fill these)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'fayzulloh086@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME', 'fayzulloh086@gmail.com')

serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

def send_verification_email(email, username):
    token = serializer.dumps(email, salt='email-confirm')
    verify_url = url_for('confirm_email', token=token, _external=True)
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "CHUVASHI | Email Verification"
    msg['From'] = app.config['MAIL_DEFAULT_SENDER']
    msg['To'] = email

    html = f"""
    <html>
    <body style="background-color: #050508; color: #ffffff; font-family: 'Outfit', sans-serif; padding: 40px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: #0a0a12; border: 1px solid #00f2ea; border-radius: 15px; padding: 30px;">
            <h1 style="color: #00f2ea; letter-spacing: 2px;">DEKO <span style="color: #ff0050;">GAMING</span></h1>
            <p style="font-size: 18px; color: #ddd;">Assalomu alaykum, <strong>{username}</strong>!</p>
            <p style="color: #bbb;">Welcome to the Chuvashi community. Click the button below to activate your account:</p>
            <div style="margin: 30px 0;">
                <a href="{verify_url}" style="background: #00f2ea; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase;">Verify Account</a>
            </div>
            <p style="font-size: 12px; color: #555;">If you did not register on this site, please ignore this message.</p>
        </div>
    </body>
    </html>
    """
    msg.attach(MIMEText(html, 'html'))

    try:
        server = smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT'])
        server.starttls()
        server.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False


db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'index_page'

# --- Models ---
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password = db.Column(db.String(120), nullable=True)
    steam_id = db.Column(db.String(32), unique=True, nullable=True)
    role = db.Column(db.String(20), default='user')
    rank = db.Column(db.String(50), default='Member')
    dcoins = db.Column(db.Integer, default=0)
    avatar = db.Column(db.String(255), default='https://via.placeholder.com/150/00f2ea/ffffff?text=User')
    banned = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=True) # Changed from False to True
    pending_privilege = db.Column(db.Boolean, default=False)
    last_purchase = db.Column(db.String(100), nullable=True) # New: track what was bought
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "rank": self.rank,
            "dcoins": self.dcoins,
            "avatar": self.avatar,
            "banned": self.banned,
            "email_verified": self.email_verified,
            "pending_privilege": self.pending_privilege,
            "steam_id": self.steam_id,
            "created_at": self.created_at.strftime('%Y-%m-%d')
        }


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    tag = db.Column(db.String(50))
    desc = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ShopItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50))
    image = db.Column(db.String(255))

class ForumThread(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author_name = db.Column(db.String(80))
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    replies_count = db.Column(db.Integer, default=0)
    content = db.Column(db.Text, nullable=True) # Added content field

class ForumReply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    thread_id = db.Column(db.Integer, db.ForeignKey('forum_thread.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='replies')

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='messages')

class GameServer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip = db.Column(db.String(50), nullable=False)
    port = db.Column(db.Integer, default=27015)
    map = db.Column(db.String(50), default='de_dust2')
    players = db.Column(db.Integer, default=0)
    max_players = db.Column(db.Integer, default=32)
    status = db.Column(db.String(20), default='online')


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Auth & Steam ---

@app.route('/api/auth/steam/callback')
def steam_callback():
    params = request.args
    if not params.get('openid.mode'): return redirect(url_for('index_page'))
    
    claimed_id = params.get('openid.claimed_id', '')
    if not claimed_id or 'steamcommunity.com/openid/id/' not in claimed_id:
        return redirect(url_for('index_page'))
    
    steam_id = claimed_id.split('/')[-1]
    nickname = f'SteamUser_{steam_id[-4:]}'
    avatar_url = 'https://via.placeholder.com/150/00f2ea/ffffff?text=Steam'
    
    try:
        import requests
        api_key = os.environ.get('STEAM_API_KEY', 'YOUR_STEAM_API_KEY') 
        data_fetched = False

        if api_key != 'YOUR_STEAM_API_KEY':
            api_url = f'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={api_key}&steamids={steam_id}'
            response = requests.get(api_url, timeout=5)
            if response.ok:
                players = response.json().get('response', {}).get('players', [])
                if players:
                    nickname = players[0].get('personaname', nickname)
                    avatar_url = players[0].get('avatarfull', avatar_url)
                    data_fetched = True

        if not data_fetched:
            import xml.etree.ElementTree as ET
            xml_url = f'https://steamcommunity.com/profiles/{steam_id}/?xml=1'
            response = requests.get(xml_url, timeout=5)
            if response.ok:
                root = ET.fromstring(response.content)
                nickname_node = root.find('steamID')
                avatar_node = root.find('avatarFull')
                if nickname_node is not None: nickname = nickname_node.text
                if avatar_node is not None: avatar_url = avatar_node.text
    except Exception as e:
        print(f"Steam Data Sync Error: {e}")
    
    user = User.query.filter_by(steam_id=steam_id).first()
    if not user:
        existing_user = User.query.filter_by(username=nickname).first()
        final_username = nickname if not existing_user else f"{nickname}_{steam_id[-4:]}"
        user = User(username=final_username, steam_id=steam_id, avatar=avatar_url, role='user', rank='Member', dcoins=100, email_verified=True)
        db.session.add(user)
        db.session.commit()
    else:
        user.username = nickname
        user.avatar = avatar_url
        user.email_verified = True
        db.session.commit()
    
    if user.banned: return "Access denied: this Steam account is banned.", 403
    login_user(user, remember=True)
    return redirect(url_for('index_page'))

@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    data = request.json
    user = User.query.filter_by(username=data.get('username'), password=data.get('password')).first()
    if user:
        if user.banned: return jsonify({"error": "This account is permanently banned."}), 403
        login_user(user, remember=True)
        return jsonify({"success": True, "user": {
            "username": user.username, 
            "role": user.role, 
            "rank": user.rank,
            "avatar": user.avatar, 
            "dcoins": user.dcoins,
            "email_verified": user.email_verified
        }})
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/auth/register', methods=['POST'])
def auth_register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Barcha maydonlarni to'ldiring"}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email is already registered"}), 400
    
    new_user = User(
        username=username,
        email=email,
        password=password, # In a real app, hash this!
        role='user',
        rank='Member',
        dcoins=100,
        email_verified=True
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    login_user(new_user, remember=True)
    return jsonify({"success": True, "msg": "Registration successful!"})

@app.route('/verify/<token>')
def confirm_email(token):
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return '<h1>Link expired!</h1>', 400
    except:
        return '<h1>Invalid link!</h1>', 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        user.email_verified = True
        db.session.commit()
        return redirect(url_for('index_page', verified='true'))
    
    return '<h1>User not found!</h1>', 404

@app.route('/api/auth/resend-verification', methods=['POST'])
@login_required
def resend_verification():
    if current_user.email_verified:
        return jsonify({"error": "Email is already verified"}), 400
    
    if send_verification_email(current_user.email, current_user.username):
        return jsonify({"success": True, "msg": "Verification email sent again!"})
    return jsonify({"error": "Failed to send email"}), 500

@app.route('/api/auth/logout')
def auth_logout():
    logout_user()
    return jsonify({"success": True})

# --- Shop & FCoin ---

@app.route('/api/shop/purchase', methods=['POST'])
@login_required
def shop_purchase():
    data = request.json
    item = ShopItem.query.get(data.get('item_id'))
    if not item: return jsonify({"error": "Item not found"}), 404
    if item.category == 'Currency':
        # Simulate payment - add dcoins instead of subtracting
        try:
            amount = int(item.name.split(' ')[0])
            current_user.dcoins += amount
            db.session.commit()
            return jsonify({"success": True, "new_balance": current_user.dcoins, "msg": f"{amount} dcoin qo'shildi!"})
        except: pass

    if current_user.dcoins < item.price: return jsonify({"error": "dcoin balansi yetarli emas"}), 400
        
    current_user.dcoins -= item.price
    if item.category == 'Imtiyoz':
        if 'admin' in item.name.lower():
            current_user.role = 'admin'
        else:
            current_user.role = 'vip'
        current_user.rank = item.name # Rank matches privilege name
        current_user.pending_privilege = True
        current_user.last_purchase = item.name 
        
    db.session.commit()
    return jsonify({"success": True, "new_balance": current_user.dcoins, "new_role": current_user.role, "new_rank": current_user.rank})

@app.route('/api/admin/add-dcoins', methods=['POST'])
@login_required
def admin_add_dcoins():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if user:
        user.dcoins += data.get('amount', 100)
        db.session.commit()
        return jsonify({"success": True, "new_balance": user.dcoins})
    return jsonify({"error": "User not found"}), 404

@app.route('/api/admin/clear-glow', methods=['POST'])
@login_required
def admin_clear_glow():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    user = User.query.filter_by(username=request.json.get('username')).first()
    if user:
        user.pending_privilege = False
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"error": "User not found"}), 404

# --- New Features API ---

@app.route('/api/chat/messages')
def api_chat_messages():
    msgs = ChatMessage.query.order_by(ChatMessage.created_at.desc()).limit(50).all()
    return jsonify([{
        "id": m.id,
        "user": m.user.username,
        "avatar": m.user.avatar,
        "role": m.user.role,
        "content": m.content,
        "time": m.created_at.strftime('%H:%M')
    } for m in msgs][::-1])

@app.route('/api/chat/send', methods=['POST'])
@login_required
def api_chat_send():
    data = request.json
    content = data.get('content', '').strip()
    if not content: return jsonify({"error": "Empty message"}), 400
    if len(content) > 500: return jsonify({"error": "Xabar juda uzun"}), 400
    
    msg = ChatMessage(user_id=current_user.id, content=content)
    db.session.add(msg)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/user/upload-avatar', methods=['POST'])
@login_required
def api_upload_avatar():
    if 'file' not in request.files: return jsonify({"error": "Fayl tanlanmadi"}), 400
    file = request.files['file']
    if file.filename == '': return jsonify({"error": "Fayl tanlanmadi"}), 400
    
    if file:
        filename = f"user_{current_user.id}_{int(time.time())}.png" # Force PNG extension for simplicity or preserve
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        url = f"/static/uploads/{filename}"
        current_user.avatar = url
        db.session.commit()
        return jsonify({"success": True, "avatar": url})
    return jsonify({"error": "Xatolik"}), 500



@app.route('/api/init')
def api_init():
    global server_cache
    if not News.query.first():
        db.session.add(News(title='System Online', tag='Update', desc='Migration completed. dcoin economy is now active.'))
        db.session.commit()
    
    # Ensure current shop items
    existing_items = [i.name for i in ShopItem.query.all()]
    new_items = [
        ShopItem(name='Elita VIP', price=1000, category='Imtiyoz', image='https://via.placeholder.com/400x250/00f2ea/000000?text=VIP'),
        ShopItem(name='Premium Admin', price=2500, category='Imtiyoz', image='https://via.placeholder.com/400x250/ff0050/ffffff?text=Admin'),
        ShopItem(name='100 dcoin Packet', price=2, category='Currency', image='/static/assets/img/coin.png'),
        ShopItem(name='300 dcoin Packet', price=5, category='Currency', image='/static/assets/img/coin.png'),
        ShopItem(name='450 dcoin Packet', price=7, category='Currency', image='/static/assets/img/coin.png'),
        ShopItem(name='800 dcoin Packet', price=13, category='Currency', image='/static/assets/img/coin.png'),
        ShopItem(name='1000 dcoin Packet', price=20, category='Currency', image='/static/assets/img/coin.png'),
        ShopItem(name='1500 dcoin Packet', price=26, category='Currency', image='/static/assets/img/coin.png')
    ]
    for item in new_items:
        existing = ShopItem.query.filter_by(name=item.name).first()
        if not existing:
            db.session.add(item)
        else:
            # Update category and image to match current config
            existing.category = item.category
            existing.image = item.image
    db.session.commit()

    if not ForumThread.query.first():
        db.session.add(ForumThread(title='Welcome to Chuvashi', author_name='Admin', category='General', content='Forum is live. You can leave your questions here.'))
        db.session.commit()

    if not GameServer.query.first():
        db.session.add(GameServer(name='AIM #1 USP', ip='94.158.55.106', port=27219, map='de_dust2', players=0, max_players=28))
        db.session.add(GameServer(name='Chuvashi #1 [PUBLIC]', ip='127.0.0.1', port=27015, map='de_dust2', players=12, max_players=32))
        db.session.add(GameServer(name='Chuvashi #2 [ONLY DUST2]', ip='127.0.0.1', port=27016, map='de_dust2', players=24, max_players=32))
        db.session.add(GameServer(name='Chuvashi #3 [AWP LEGO]', ip='127.0.0.1', port=27017, map='awp_lego_2', players=8, max_players=16))
        db.session.commit()
        server_cache["data"] = None
        server_cache["last_updated"] = 0

    return jsonify({"status": "initialized"})

@app.route('/api/news')
def get_news():
    news = News.query.order_by(News.created_at.desc()).all()
    return jsonify([{"id": n.id, "title": n.title, "tag": n.tag, "desc": n.desc, "date": n.created_at.strftime('%Y-%m-%d')} for n in news])

@app.route('/api/shop')
def get_shop():
    items = ShopItem.query.all()
    return jsonify([{"id": i.id, "name": i.name, "price": i.price, "category": i.category, "image": i.image} for i in items])

@app.route('/api/forum/threads')
def get_threads():
    threads = ForumThread.query.order_by(ForumThread.created_at.desc()).all()
    return jsonify([{"id": t.id, "title": t.title, "author": t.author_name, "category": t.category, "replies": t.replies_count, "date": t.created_at.strftime('%Y-%m-%d')} for t in threads])

@app.route('/api/forum/create', methods=['POST'])
@login_required
def api_forum_create():
    data = request.json
    title = data.get('title')
    content = data.get('content')
    category = data.get('category', 'Umumiy')
    
    if not title or not content: return jsonify({"error": "Sarlavha va matn talab qilinadi"}), 400
    
    thread = ForumThread(title=title, author_name=current_user.username, category=category, content=content)
    db.session.add(thread)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/forum/thread/<int:thread_id>')
def api_forum_thread_detail(thread_id):
    thread = ForumThread.query.get_or_404(thread_id)
    replies = ForumReply.query.filter_by(thread_id=thread_id).all()
    return jsonify({
        "id": thread.id,
        "title": thread.title,
        "content": thread.content,
        "author": thread.author_name,
        "date": thread.created_at.strftime('%Y-%m-%d %H:%M'),
        "replies": [{
            "user": r.user.username,
            "avatar": r.user.avatar,
            "content": r.content,
            "date": r.created_at.strftime('%Y-%m-%d %H:%M')
        } for r in replies]
    })

@app.route('/api/forum/reply', methods=['POST'])
@login_required
def api_forum_reply():
    data = request.json
    thread_id = data.get('thread_id')
    content = data.get('content')
    
    if not content: return jsonify({"error": "Empty reply"}), 400
    
    thread = ForumThread.query.get(thread_id)
    if not thread: return jsonify({"error": "Thread not found"}), 404
    
    reply = ForumReply(thread_id=thread_id, user_id=current_user.id, content=content)
    thread.replies_count += 1
    db.session.add(reply)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/admin/news/add', methods=['POST'])
@login_required
def api_admin_news_add():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    news = News(title=data.get('title'), tag=data.get('tag'), desc=data.get('desc'))
    db.session.add(news)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/admin/news/delete', methods=['POST'])
@login_required
def api_admin_news_delete():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    news = News.query.get(request.json.get('id'))
    if news:
        db.session.delete(news)
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"error": "Not found"}), 404

@app.route('/api/admin/servers/add', methods=['POST'])
@login_required
def api_admin_servers_add():
    global server_cache
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    server = GameServer(
        name=data.get('name'),
        ip=data.get('ip'),
        port=int(data.get('port', 27015)),
        map=data.get('map', 'de_dust2'),
        players=int(data.get('players', 0)),
        max_players=int(data.get('max_players', 32))
    )
    db.session.add(server)
    db.session.commit()
    server_cache["data"] = None
    server_cache["last_updated"] = 0
    return jsonify({"success": True})

@app.route('/api/admin/servers/delete', methods=['POST'])
@login_required
def api_admin_servers_delete():
    global server_cache
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    server = GameServer.query.get(request.json.get('id'))
    if server:
        db.session.delete(server)
        db.session.commit()
        server_cache["data"] = None
        server_cache["last_updated"] = 0
        return jsonify({"success": True})
    return jsonify({"error": "Server not found"}), 404


@app.route('/api/admin/servers/update', methods=['POST'])
@login_required
def api_admin_servers_update():
    global server_cache
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    server = GameServer.query.get(data.get('id'))
    if server:
        server.name = data.get('name', server.name)
        server.ip = data.get('ip', server.ip)
        server.port = int(data.get('port', server.port))
        server.map = data.get('map', server.map)
        server.max_players = int(data.get('max_players', server.max_players))
        db.session.commit()
        server_cache["data"] = None
        server_cache["last_updated"] = 0
        return jsonify({"success": True})
    return jsonify({"error": "Server not found"}), 404


@app.route('/api/users')
@login_required
def get_users():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    return jsonify([{
        "username": u.username, 
        "role": u.role, 
        "rank": u.rank,
        "dcoins": u.dcoins, 
        "banned": u.banned, 
        "pending_privilege": u.pending_privilege,
        "last_purchase": u.last_purchase,
        "avatar": u.avatar
    } for u in User.query.all()])

@app.route('/api/bans')
def get_bans():
    return jsonify([{"username": u.username, "avatar": u.avatar, "role": u.role} for u in User.query.filter_by(banned=True).all()])

@app.route('/api/admin/toggle-ban', methods=['POST'])
@login_required
def admin_toggle_ban():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    user = User.query.filter_by(username=request.json.get('username')).first()
    if user:
        if user.username == current_user.username: return jsonify({"error": "O'zini ban qilish mumkin emas"}), 400
        user.banned = not user.banned
        db.session.commit()
        return jsonify({"success": True, "new_status": user.banned})
    return jsonify({"error": "User not found"}), 404

@app.route('/api/admin/remove-vip', methods=['POST'])
@login_required
def admin_remove_vip():
    if current_user.role != 'admin': return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if user:
        user.role = 'user'
        user.rank = 'Member'
        user.pending_privilege = False
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"error": "User not found"}), 404


@app.route('/api/user/me')
def get_me():
    if current_user.is_authenticated:
        return jsonify({
            "username": current_user.username, 
            "role": current_user.role, 
            "rank": current_user.rank,
            "dcoins": current_user.dcoins, 
            "avatar": current_user.avatar, 
            "steam_id": current_user.steam_id,
            "email_verified": current_user.email_verified
        })
    return jsonify({"error": "Guest"}), 401

# --- Pages ---
@app.route('/')
def index_page(): return render_template('index.html')
@app.route('/shop')
@login_required
def shop_page(): return render_template('shop.html')
@app.route('/profile')
@login_required
def profile_page(): return render_template('profile.html')
@app.route('/forum')
@login_required
def forum_page(): return render_template('forum.html')
@app.route('/admin')
@login_required
def admin_page():
    if current_user.role != 'admin': return redirect(url_for('index_page'))
    return render_template('admin.html')
@app.route('/bans')
@login_required
def bans_page(): return render_template('bans.html')

@app.route('/servers')
def servers_page(): return render_template('servers.html')

@app.route('/ruler')
def ruler_page(): return render_template('ruler.html')

@app.route('/rules')
def rules_page(): return render_template('ruler.html')

# Server cache system
server_cache = {
    "data": None,
    "last_updated": 0
}
CACHE_DURATION = 120 # Cache for 2 minutes

def fetch_real_server_info(ip, port, default_name):
    try:
        address = (ip, port)
        with ServerQuerier(address, timeout=5) as server:
            info = server.info()
            # Clean non-ascii characters to prevent Windows console/logging errors
            raw_name = info["server_name"]
            clean_name = "".join(i for i in raw_name if ord(i) < 128)
            if not clean_name.strip(): clean_name = default_name

            return {
                "name": clean_name,
                "map": info["map"],
                "players": info["player_count"],
                "max_players": info["max_players"],
                "status": "online"
            }
    except Exception as e:
        # Avoid printing 'e' directly as it might contain the problematic server name
        print(f"Server query failed for {ip}:{port}")
        return {
            "status": "offline",
            "players": 0,
            "max_players": 32,
            "map": "N/A"
        }

@app.route('/api/servers')
def get_servers():
    global server_cache
    now = time.time()
    
    if server_cache["data"] and (now - server_cache["last_updated"]) < CACHE_DURATION:
        response = jsonify(server_cache["data"])
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        return response

    servers = GameServer.query.all()
    results = []
    
    for s in servers:
        # Auto-clean IP if it contains a port
        clean_ip = s.ip.split(':')[0] if ':' in s.ip else s.ip
        
        results.append({
            "id": s.id,
            "name": s.name,
            "ip": clean_ip,
            "port": s.port,
            "map": s.map,
            "status": "online"
        })
            
    server_cache["data"] = results
    server_cache["last_updated"] = now
    response = jsonify(results)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            db.session.add(User(username='admin', password='123', role='admin', rank='Admin', dcoins=10000))
            db.session.commit()
            
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
