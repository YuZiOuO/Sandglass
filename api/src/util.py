from passlib.context import CryptContext

hash_scheme = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_hash(plain: str):
    return hash_scheme.hash(plain)


def verify_hash(plain: str, hashed: str):
    return hash_scheme.verify(plain, hashed)
