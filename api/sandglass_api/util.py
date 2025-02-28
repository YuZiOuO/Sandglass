import hashlib

def salting(original_str:str,salt:str) -> str:
    return hashlib.sha256((original_str+salt).encode()).hexdigest()