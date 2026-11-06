#!/usr/bin/env bash
# Chạy kiểm thử RLS trên database Supabase cục bộ.
# Yêu cầu: npx supabase start && npx supabase db reset
set -euo pipefail
DB_URL="${SUPABASE_DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"
cd "$(dirname "$0")"
output=$(psql "$DB_URL" -q -o /dev/null -v ON_ERROR_STOP=1 -f rls.test.sql 2>&1) || { echo "$output"; echo "❌ Kiểm thử RLS THẤT BẠI"; exit 1; }
echo "$output" | sed -E 's/^psql:[^ ]+ NOTICE:  //'
