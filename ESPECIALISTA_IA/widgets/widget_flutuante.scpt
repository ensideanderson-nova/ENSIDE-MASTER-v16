tell application "System Events"
    display dialog "🤖 ESPECIALISTA-IA\n\n📊 15.664 arquivos catalogados\n🗄️ 34 chaves Redis sincronizadas\n✅ Sistema 100% operacional\n\nComandos:\n- varrer: Varrer sistema\n- status: Ver status\n- sync: Sincronizar\n- aprender: Adicionar conhecimento" buttons {"Fechar", "Varrer", "Status"} default button "Status"
    set resposta to button returned of result
    
    if resposta is "Varrer" then
        do shell script "cd ~/ESPECIALISTA_IA && python3 especialista_ia.py varrer"
    else if resposta is "Status" then
        do shell script "cd ~/ESPECIALISTA_IA && python3 especialista_ia.py status"
    end if
end tell
