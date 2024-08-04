async function ir_excel(orcam_) {
    var dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))[orcam_];
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'));

    // Cria um novo workbook e uma nova planilha
    var wb = new ExcelJS.Workbook();
    var ws_orcamento = wb.addWorksheet('Orçamento');
    var ws_total = wb.addWorksheet('TOTAL');

    // Baixa a imagem e converte para base64
    const response = await fetch('https://i.imgur.com/Nb8sPs0.png');
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);

    var total_venda = 0;
    var total_servico = 0;

    reader.onloadend = () => {
        const base64data = reader.result.replace(/^data:image\/(png|jpg);base64,/, '');

        // Adiciona a imagem ao workbook
        const imageId = wb.addImage({
            base64: base64data,
            extension: 'png',
        });

        // Define os cabeçalhos das tabelas
        var estado = dados_orcamentos['dados_orcam'].estado;
        var nome_arquivo = dados_orcamentos['dados_orcam']['nome_projeto'] + ' ' + dados_orcamentos['dados_orcam']['contrato'];

        var venda_headers = [
            ["Item", "SAP ID", "REF ID", "NCM", "Descrição", "Quantidade", "Valor Unit Liq", "Valor Total Liq", "%ICMS", "Valor UNIT", "Valor Total"]
        ];
        var servico_headers = [
            ["Item", "SAP ID", "REF ID", "NCM", "Descrição", "Quantidade", "Valor UNIT", "Valor Total"]
        ];

        var venda_data = [];
        var servico_data = [];

        // Adiciona os dados às tabelas de venda e serviço
        dados_orcamentos['dados_composicoes'].forEach(item => {
            var unit_ = conversor(item.custo);
            var total_ = conversor(item.total);
            let valor_unit_liq = item.tipo == "VENDA" || item.tipo == "COTAÇÃO" ? unit_ - (unit_ * (estado == 'BA' ? 0.205 : 0.12)) : unit_;
            let valor_total_liq = item.tipo == "VENDA" || item.tipo == "COTAÇÃO" ? total_ - (total_ * (estado == 'BA' ? 0.205 : 0.12)) : total_;
            let porcent_icms = item.tipo == "VENDA" || item.tipo == "COTAÇÃO" ? (estado == 'BA' ? '20,5%' : '12%') : '0%';

            try {
                var sapId = dados_composicoes[item.codigo]['sap id']
                var refId = dados_composicoes[item.codigo]['ref id']
            } catch {
                var sapId = ''
                var refId = ''
            }

            if (item.tipo == 'VENDA') {
                venda_data.push([
                    item.codigo,
                    sapId,
                    refId,
                    item.ncm,
                    item.descricao,
                    conversor(item.qtde),
                    valor_unit_liq,
                    valor_total_liq,
                    porcent_icms,
                    unit_,
                    total_
                ]);
                total_venda += total_;
            } else {
                servico_data.push([
                    item.codigo,
                    sapId,
                    refId,
                    item.ncm,
                    item.descricao,
                    conversor(item.qtde),
                    unit_,
                    total_
                ]);
                total_servico += total_;
            }
        });

        // Adiciona as tabelas de venda e serviço à planilha Orçamento
        ws_orcamento.addRow(['', 'Orçamento: ' + nome_arquivo + ' - TOTAL: ' + dados_orcamentos['total_geral']]);
        ws_orcamento.addRows(venda_headers);
        ws_orcamento.addRows(venda_data);

        // Total de venda
        ws_orcamento.addRow([]);
        ws_orcamento.addRow(['', '', '', '', '', '', '', '', '', 'Total Venda', total_venda]);
        ws_orcamento.getRow(ws_orcamento.lastRow.number).eachCell((cell) => {
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' }
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFB12425' }
            };
        });

        ws_orcamento.addRow([]); // Linha em branco entre as tabelas

        ws_orcamento.addRows(servico_headers);
        ws_orcamento.addRows(servico_data);

        // Total de serviço
        ws_orcamento.addRow([]);
        ws_orcamento.addRow(['', '', '', '', '', '', 'Total Serviço', total_servico]);
        ws_orcamento.getRow(ws_orcamento.lastRow.number).eachCell((cell) => {
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' }
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF008000' }
            };
        });

        // Estiliza os cabeçalhos
        ws_orcamento.getRow(2).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFB12425' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' }
            };
        });

        ws_orcamento.getRow(venda_data.length + 6).eachCell((cell) => { // Ajustado para o número da linha correto
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF008000' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' }
            };
        });

        ['G', 'H', 'J', 'K'].forEach(col => {
            ws_orcamento.getColumn(col).numFmt = '_-R$* #,##0.00_-;-R$* #,##0.00_-;_-R$* "-"??_-;_-@_-';
        });

        // Define a largura das colunas
        ws_orcamento.columns.forEach(column => {
            if (column._number == 5) {
                column.width = 50;
            } else {
                column.width = 14;
            }
        });

        // Adiciona a imagem à planilha Orçamento com as dimensões e posição especificadas
        ws_orcamento.addImage(imageId, {
            tl: { col: 0, row: 0 }, // Inicia na célula A1
            ext: { width: 3.25 * 28.35, height: 3.25 * 28.35 } // Converte cm para pixels (1 cm = 28.35 pixels)
        });

        // Define a altura da primeira linha igual à altura da imagem
        ws_orcamento.getRow(1).height = 3 * 28.35; // Altura em pixels

        const headerCell = ws_orcamento.getCell('B1');
        headerCell.font = {
            size: 28,
            color: { argb: '1155CC' },
            bold: true
        };
        headerCell.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };

        // Adiciona a aba "TOTAL" com os dados resumidos
        var ws_total_data = [
            [],
            [],
            ['Orçamento: ' + nome_arquivo],
            ["TOTAL DE VENDA", total_venda],
            ["TOTAL DE SERVIÇO", total_servico],
            ["TOTAL GERAL", total_venda + total_servico]
        ];

        ws_total.addRows(ws_total_data);

        const headerCell2 = ws_total.getCell('A3');
        headerCell2.font = {
            size: 15,
            color: { argb: '1155CC' },
            bold: true
        };
        headerCell2.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };

        ws_total.getColumn(1).width = 20;
        ws_total.getColumn(2).width = 20;
        ws_total.getColumn(2).numFmt = '_-R$* #,##0.00_-;-R$* #,##0.00_-;_-R$* "-"??_-;_-@_-';

        // Adiciona a imagem à planilha TOTAL com as dimensões e posição especificadas
        ws_total.addImage(imageId, {
            tl: { col: 0, row: 0 }, // Inicia na célula A1
            ext: { width: 3.25 * 28.35, height: 3.25 * 28.35 } // Converte cm para pixels (1 cm = 28.35 pixels)
        });

        ws_total.getRow(1).height = 3 * 28.35; // Altura em pixels

        // Estiliza apenas os textos das linhas de totais
        for (let i = 4; i <= 6; i++) {
            let cell = ws_total.getCell('A' + i);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '1155CC' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' }
            };
        }

        var filename = nome_arquivo + '.xlsx';

        wb.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
        });
    };
}


async function salvarTabelaEmExcel() {
    const tabela = document.getElementById("orcamento_");
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Orçamento');

    const response = await fetch('https://i.imgur.com/qZLbNfb.png');
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);

    reader.onloadend = async () => {
        const base64data = reader.result.replace(/^data:image\/(png|jpg);base64,/, '');
        const imageId = wb.addImage({
            base64: base64data,
            extension: 'png',
        });

        const linhas = tabela.querySelectorAll('tr');
        const dadosTabela = [];

        const cabecalho = linhas[0].querySelectorAll('th');
        const cabecalhoFormatado = Array.from(cabecalho).map(col => col.innerText.trim());
        dadosTabela.push(cabecalhoFormatado);

        linhas.forEach((linha, index) => {
            const colunas = linha.querySelectorAll('td, th');
            const dadosLinha = [];

            colunas.forEach((coluna, colIndex) => {
                if (colIndex < colunas.length - 1) {
                    dadosLinha.push(coluna.innerText.trim());
                }
            });

            if (dadosLinha.length > 0 && index !== 0) {
                dadosTabela.push(dadosLinha);
            }
        });

        dadosTabela.unshift(['']);
        dadosTabela.unshift(['']);
        dadosTabela.unshift(['']);
        dadosTabela.unshift(['']);
        dadosTabela.unshift(['']);

        ws.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 6.2 * 28.35, height: 3.5 * 28.35 }
        });

        ws.addRows(dadosTabela);

        // Define a cor de fundo para o intervalo A1:K5
        for (let rowIndex = 1; rowIndex <= 5; rowIndex++) { // De A1 a A5
            for (let colIndex = 1; colIndex <= 11; colIndex++) { // De A a K
                const cell = ws.getCell(rowIndex, colIndex);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF151749' } // Cor de fundo #151749
                };
            }
        }

        const headerRow = ws.getRow(6); // A linha do cabeçalho após as 4 linhas em branco
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFB12425' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
        });

        ws.columns.forEach(column => {
            const maxLength = column.values.reduce((max, val) => Math.max(max, (val || '').toString().length), 0);
            column.width = maxLength + 2;
        });

        const nomeArquivo = 'orcamentos.xlsx';
        const buffer = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nomeArquivo);
    };
}
