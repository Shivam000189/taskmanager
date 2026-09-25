import os

from app import create_app
from app.config import Config

app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(
        debug=Config.FLASK_DEBUG,
        host="0.0.0.0",
        port=port
    )