import hashlib
from dataclasses import fields


def parse_object_from_dict(class_name, arg_dict: dict):
    # get all fields the given class defined
    fields_set = (f.name for f in fields(class_name))

    # get all fields the arguments contained
    filtered = filter(lambda field: field in fields_set, arg_dict.keys())

    # construct the new arg dict
    reconstructed = {k: arg_dict[k] for k in filtered}

    return class_name(**reconstructed)

def salting(original_str:str,salt:str):
    return hashlib.sha256((original_str+salt).encode())