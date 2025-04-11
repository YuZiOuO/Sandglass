import flask
from flask import Blueprint, request, current_app
from mongoengine import ValidationError

from sandglass_api.middleware.oss_module import get_bucket
from sandglass_api.models.attachment import Attachment
from sandglass_api.module.project_api import abstract_get_proj_by_id
from sandglass_api.util import transaction

attachment_api = Blueprint('attachment_api', __name__)


def abstract_get_atmt_by_id(atmt_id: str) -> tuple[Attachment | str, int]:
    try:
        atmt = Attachment.objects().with_id(atmt_id)
    except ValidationError as e:
        return str(e), 400
    if not atmt:
        flask.abort(404)
    return atmt, 200


@attachment_api.get('/atmt/<string:atmt_id>')
def get_download_sign_url(atmt_id: str):
    atmt, code = abstract_get_atmt_by_id(atmt_id)
    if code != 200:
        return atmt, code
    return get_bucket().sign_url('GET', str(atmt.id), current_app.config['OSS_SIGNATURE_EXPIRE_TIME'])


@attachment_api.get('/<string:proj_id>/atmt')
def get_attachment_by_proj(proj_id: str):
    pass


@attachment_api.get('/<string:node_id>/atmt')
def get_attachment_by_node(proj_id: str):
    pass


@attachment_api.post('/<string:proj_id>/atmt')
def create_attachment_by_proj(proj_id: str):
    p, code = abstract_get_proj_by_id(proj_id)
    if code != 200:
        return p, code

    @transaction
    def create_attachment():
        atmt = Attachment.from_json(request.json)
        atmt.save()
        p.attachments.append(atmt)
        return get_bucket().sign_url('POST', str(atmt.id), OSS_SIGNATURE_EXPIRE_TIME)

    return create_attachment()


@attachment_api.post('/<string:node_id>/atmt')
def create_attachment_by_node(node_id: str):
    pass


@attachment_api.put('/atmt/<string:atmt_id>')
def get_upload_sign_url():
    pass


@attachment_api.delete('/atmt/<string:atmt_id>')
def delete_attachment():
    pass


@attachment_api.get('/atmt/<string:atmt_id>/v')
def get_history_versions():
    pass


@attachment_api.get('/atmt/<string:atmt_id>/v/<string:version_id>')
def get_history_version_download_sign_url():
    pass
