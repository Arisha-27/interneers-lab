from flask import Blueprint, jsonify, request, current_app

category_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


def get_service():
    return current_app.config["CATEGORY_SERVICE"]


@category_bp.route("/", methods=["GET"])
def get_all():
    categories = get_service().get_all_categories()
    return jsonify([vars(c) for c in categories]), 200


@category_bp.route("/<category_id>", methods=["GET"])
def get_one(category_id):
    try:
        category = get_service().get_category_by_id(category_id)
        return jsonify(vars(category)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@category_bp.route("/", methods=["POST"])
def create():
    body = request.get_json(silent=True)

    if not body:
        return jsonify({"error": "Request body required"}), 400

    name = body.get("name")
    description = body.get("description", "")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    try:
        category = get_service().create_category(name, description)
        return jsonify(vars(category)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@category_bp.route("/<category_id>", methods=["PUT"])
def update(category_id):
    body = request.get_json(silent=True)

    if not body:
        return jsonify({"error": "Request body required"}), 400

    try:
        updated = get_service().update_category(category_id, body)
        return jsonify({"updated": updated}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@category_bp.route("/<category_id>", methods=["DELETE"])
def delete(category_id):
    try:
        deleted = get_service().delete_category(category_id)
        return jsonify({"deleted": deleted}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404