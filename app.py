import os, json
from datetime import datetime
from flask import Flask, render_template

app = Flask(__name__)
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'events.json')

def load_timeline():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        events = json.load(f)

    events.sort(key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'))

    roster = {}
    enriched = []
    for ev in events:
        name = ev.get('name', '').strip()
        role = ev.get('role', '').strip()
        comment = (ev.get('comment') or '').strip()
        act = ev.get('type', 'join')

        if act == 'join':
            roster[name] = role
        elif act == 'leave':
            roster.pop(name, None)

        enriched.append({
            **ev,
            'comment': comment,
            'snapshot': [{'name': n, 'role': r} for n, r in roster.items()],
            'count': len(roster)
        })
    return enriched

@app.route('/')
def index():
    events = load_timeline()
    curr_count = events[-1]['count'] if events else 0
    return render_template('index.html', events=events, current_count=curr_count)

if __name__ == '__main__':
    app.run(debug=True, port=5000)