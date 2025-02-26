from dataclasses import fields

from gi.overrides.keysyms import value


def parse_object_from_dict(class_name,arg_dict:dict):
    # get all fields the class contained
    filtered = filter(lambda field:field in fields(class_name),arg_dict.keys())
    # construct the new arg dict
    reconstructed = {k:arg_dict[k] for k in filtered}
    return class_name(**reconstructed)