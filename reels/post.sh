#!/bin/sh
# Lee posts del blog desde la base local de vej-api, SOLO LECTURA, por socket Unix (el sandbox no abre loopback TCP).
#   sh reels/post.sh --list                  → slug · categoría · título de los publicados (recientes primero)
#   sh reels/post.sh <slug> [<slug2>]        → JSON {title, category, tags, excerpt, text} por post (a stdout)
# Guárdalo tú en reels/<id>/sources.json:  sh reels/post.sh a b > reels/<id>/sources.json
set -e
API=${VEJ_API:-/var/www/vej-api}
cd "$API"
export DB_HOST=${DB_HOST_SOCKET:-/var/run/postgresql}
if [ "$1" = "--list" ]; then
  php artisan tinker --execute '
    foreach (App\Models\Post::where("status","published")->orderByDesc("published_at")->get(["slug","category","title"]) as $p)
      echo $p->slug, "\t", $p->category, "\t", $p->title, "\n";'
  exit 0
fi
[ $# -ge 1 ] || { echo "uso: post.sh --list | post.sh <slug> [<slug2>]" >&2; exit 2; }
SLUGS=$(printf '"%s",' "$@")
php artisan tinker --execute '
  $out = [];
  foreach (['"${SLUGS%,}"'] as $s) {
    $p = App\Models\Post::where("slug", $s)->first();
    if (!$p) { fwrite(STDERR, "no existe: $s\n"); continue; }
    $txt = [];
    foreach ((array) $p->content as $b) {
      $d = $b["data"] ?? [];
      if (in_array($b["type"] ?? "", ["heading","paragraph","quote"])) $txt[] = ($b["type"] === "heading" ? "## " : "") . strip_tags($d["text"] ?? "");
      if (($b["type"] ?? "") === "list") foreach (($d["items"] ?? []) as $it) $txt[] = "- " . strip_tags(is_array($it) ? ($it["content"] ?? json_encode($it)) : $it);
    }
    $out[] = ["slug" => $p->slug, "title" => $p->title, "category" => $p->category, "tags" => $p->tags, "excerpt" => $p->excerpt, "text" => implode("\n", $txt)];
  }
  echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), "\n";'
