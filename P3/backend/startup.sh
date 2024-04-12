python3 -m venv oneonone
oneonone\Scripts\activate.bat
python3 -m pip install --upgrade pip
python3 -m pip install --upgrade Pillow
python3 -m pip install --upgrade defusedxml olefile
python pip install Django
python pip install djangorestframework
python pip install djangorestframework djangorestframework-authtoken
python manage.py makemigrations
python manage.py migrate
