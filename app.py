from flask import Flask, render_template, request, jsonify, session, make_response
import json, os

app = Flask(__name__)
app.secret_key = '1235678'

# Ruta principal (SPA)
@app.route("/")
def index():
    # Cargar idioma de cookie o por defecto ES
    lang = request.cookies.get('lang', 'es')
    return render_template("index.html", lang=lang)

# API: configuración por idioma
@app.route("/api/config")
def api_config():
    lang = request.args.get("lang", "es").upper()
    path = f"conf/config{lang}.json"
    if not os.path.exists(path): return jsonify({"error": "Idioma no soportado"}), 404
    with open(path, encoding="utf-8") as f:
        return jsonify(json.load(f))

# API: listado de estudiantes
@app.route("/api/estudiantes")
def api_estudiantes():
    with open("static/datos/index.json", encoding="utf-8") as f:
        return jsonify(json.load(f))

# API: perfil por CI
@app.route("/api/perfil/<ci>")
def api_perfil(ci):
    path = f"static/datos/{ci}/perfil.json"
    if not os.path.exists(path): return jsonify({"error": "No existe"}), 404
    with open(path, encoding="utf-8") as f:
        return jsonify(json.load(f))

# Cambiar idioma (guarda en cookie)
@app.route("/api/idioma", methods=["POST"])
def cambiar_idioma():
    lang = request.json.get("lang", "es")
    resp = make_response({"mensaje": "Idioma actualizado"})
    resp.set_cookie("lang", lang)
    return resp

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
