from app.__init__ import app
from app.views import *
from app.models import *


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
