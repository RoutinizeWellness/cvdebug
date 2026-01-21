#!/bin/bash
# Script para verificar el estado del deployment de cvdebug.com

echo "🔍 Verificando estado de cvdebug.com..."
echo "======================================="
echo ""

# Verificar HTTP status
STATUS=$(curl -sI https://cvdebug.com 2>&1 | head -1)
echo "📡 Status: $STATUS"

if echo "$STATUS" | grep -q "200"; then
    echo "✅ Sitio funcionando correctamente!"
    echo ""
    echo "🎉 El deployment fue exitoso. Puedes abrir https://cvdebug.com"
    exit 0
elif echo "$STATUS" | grep -q "503"; then
    echo "⏳ Sitio aún mostrando 503 Service Unavailable"
    echo ""
    echo "Posibles causas:"
    echo "1. VLY AI aún está procesando el redeploy (puede tomar 2-5 minutos)"
    echo "2. El build está en progreso"
    echo "3. Hay un error en el build"
    echo ""
    echo "💡 Espera 2-3 minutos más y vuelve a ejecutar:"
    echo "   bash check-deploy.sh"
    echo ""
    echo "📊 Para ver logs de build, ve al panel de VLY AI:"
    echo "   https://vly.sh/dashboard"
    exit 1
else
    echo "❓ Status desconocido"
    echo ""
    echo "Por favor verifica manualmente: https://cvdebug.com"
    exit 2
fi
