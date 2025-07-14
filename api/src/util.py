from passlib.context import CryptContext

pwd_content = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_pwd_hash(plain_pwd:str):
    return pwd_content.hash(plain_pwd)

def verify_pwd(plain_pwd:str,hashed_pwd):
    return pwd_content.verify(plain_pwd, hashed_pwd)
