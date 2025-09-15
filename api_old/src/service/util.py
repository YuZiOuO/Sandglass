import hashlib

from passlib.context import CryptContext

pwd_hash_scheme = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_passlib_hash(plain: str):
    return pwd_hash_scheme.hash(plain)


def verify_passlib_hash(plain: str, hashed: str):
    return pwd_hash_scheme.verify(plain, hashed)


def generate_hashlib_hash(plain: str):
    return hashlib.sha256(plain.encode()).hexdigest()
