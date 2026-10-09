#!/usr/bin/env bash
set -e

PORT=8080
echo "Design Thinking Workshop (DTW) 로컬 서버를 실행합니다..."
echo "브라우저에서 http://localhost:${PORT} 에 접속하세요."
echo "종료하려면 Ctrl+C를 누르세요."

exec python3 -m http.server "${PORT}" --directory server
