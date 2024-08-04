const { app, BrowserWindow, dialog } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { google } = require('googleapis');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { Readable } = require('stream');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 3000;
const { exec } = require('child_process');
const https = require('https');
const sudo = require('sudo-prompt');
const { ipcMain } = require('electron'); // Importando ipcMain

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'login.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith('file://')) {
            event.preventDefault();
            mainWindow.loadURL(url);
        }
    });
}

// Configuração do servidor Express principal
const appExpress = express();

appExpress.use(bodyParser.json({ limit: '50mb' }));
appExpress.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
appExpress.use(express.static(__dirname));

// Endpoint para página inicial
appExpress.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'projetos.html'));
});

// Configuração do Google Drive API
const credentials = {
    "type": "service_account",
    "project_id": "gcs-obras",
    "private_key_id": "4d98f44dcfcc18d50380bca3af5e3bd6f4566743",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpTWzJx50stWB7\nezOiGU6RZ0ZKN37lUFQghKnpi03mO6OJ9wRCObsKyRZvcSDiIkDRM0aDRFuaj/9S\nGONgnUH69meVeTTOKHxmfhvfmRggjUVpiQWTAA20SEOEIPBeuzAmjRHV5qzq3OCy\nc9YvOHLb2xn4nqceXr5P8liBySwc1TmwTm9nq/2oMjK/3rzl6idJ5uHQqNV69OdG\njRxGbiHmGBV/kV6Biio9TknE6OJmFffrSfxMvrE6PtRgJ2HcfDw8QLX/j3T73yRb\nQi4oIiLbRNljl4P5Edox9WfWPna/VVpEL9PhScvdCK9q+0KpU97eCik7iuEB6qWp\nupV9ffJhAgMBAAECggEAHk6x7t1BEcPWZcSEVbxaCEWIm7ibisl6hee50wkRBOog\nOI5zwLc8+I1O6txBmrmvCMQ5Fz6hd2XXuwahjaYZLaf2mxd7kHxG6MIik0CAxTME\n/gN9b/dOfLuC+qA653pzADO4waXtxo2L2+ZIrWNZjGoImC0ulY04XG9x0KoGr5Jh\ng4GDK9LeYYDnUk4udDnv56juEEiE6NWuj7O3adHWFMzBZbz2Dek6/7FILqCIFizv\nuLtFDPVfGsiCl7x19t5hxFnzYHSVWq1/v9C2+9zzNyViPGfsFVu6yqFx1r9yPuXd\nO3HYZRURijtHtTp0A7yCkW78lJUkNE3GUP1wF5zyUQKBgQDa95pZmfN/wjGKE/Gs\ngsPpZiij8/1/FLdY3L1nAW6tf+LM58PvumzfYanoWsNaVwOdffYyGI8JPdAUhxqV\n1Ef9/MDpGRVonM92Ng2M3sXT7vlSRm72HiNpbG0y+Nybp+UcRDV6vaFY9be8XzyM\n/Rdfrc1COnaDYUxLpozTP2mvDwKBgQDF74nILh+cnSMeFYFXNVFE7LcL/0Oeo84y\nYyDQHnqc10O5e3ivkO1xEVCXiCgA4uJkxv0UTUVNCL90sS62fOS2/NJJ1ifgOPGa\nIQGCM4qWlHnB50IHrIBJWwrFZpABtOTZVZ9Q3u9D354Qn6RSu9k0x/0OB2nis7C2\nCQg0H5hHjwKBgGGAK0yGjrRuxhxTsSM9vvqosKQAuvnhQZrh/7xkGOJMtbLD6K1Q\nd7YoCL4b3CzX3hY8xmmcIeTdj0/0sNPSiJQB/exNbQj9+isK+pGliLVMDdyi3Dnf\nRallzGIMCj+NTSl+/ck/sx6nmz7XsWCeOdAy1dkNq0PpCU4ORVqzO93lAoGABQEm\ncapA4FvUvHj8uTC+6kg15JbCpessVnfNJ5XtsbN7od/uUDoQ1tACQqKNqGAUK0og\nsfe2LdlvxcqJDNIhkkLYKkfA4FlwOl5lRF57PY1peq6XK8x/vdsQbadHMtPZCWmx\nyoCoegXYYEE5DWJ0fnIkAsvLMJEsgZ2+2FqIJh8CgYAWS9+7Nr5iYSLW9/t8MFzH\n/6oozi1n3BOVS3kM7Iwgfq/1bcPXpWAiwHz0gZM6/PhflXsuP1dhLDiilbMSPDLw\ntT90hRnLwM4hskD2Aa7GFvnLPZLFG7Cx22tZKVHzFmHYIYGlrNkZ/uV6ujsa20ry\nXyqRgH6MUroO9PzOYtqCDQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "upload-arquivos@gcs-obras.iam.gserviceaccount.com",
    "client_id": "105239666829813301347",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/upload-arquivos%40gcs-obras.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

// Função para upload de arquivos para o Google Drive
// Endpoint para upload de arquivos para o Google Drive
appExpress.post('/upload', async (req, res) => {
    try {
        console.log('Recebendo solicitação de upload...');
        const { name, mimeType, base64 } = req.body;

        console.log('Convertendo base64 para buffer...');
        const buffer = Buffer.from(base64, 'base64');
        const fileStream = new Readable();
        fileStream.push(buffer);
        fileStream.push(null);

        const fileMetadata = {
            name: name,
            parents: ['1fBNan_Gu5eM6pE2ddZU5llEk7bdqUxzi']
        };

        const media = {
            mimeType: mimeType,
            body: fileStream
        };

        console.log('Iniciando upload para o Google Drive...');
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink'
        });

        console.log('Upload bem-sucedido:', response.data);
        res.status(200).send({
            fileId: response.data.id,
            webViewLink: response.data.webViewLink
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error.message);
        res.status(500).send('Erro ao fazer upload: ' + error.message);
    }
});

// Endpoint para gerar PDF
appExpress.post('/generate-pdf', async (req, res) => {
    const { htmlContent, nomeArquivo } = req.body;

    console.log('Recebendo solicitação para gerar PDF...');
    console.log('Nome do Arquivo:', nomeArquivo);

    // Envie uma mensagem para a janela principal abrir a janela de diálogo de salvamento
    mainWindow.webContents.send('open-save-dialog', { htmlContent, nomeArquivo });

    res.status(200).send('A janela de diálogo de salvamento foi aberta.');
});

// Função para gerar PDF
async function generatePDF(htmlContent, outputFile) {
    console.log('Iniciando processo de geração de PDF...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    console.log('Browser iniciado.');
    const page = await browser.newPage();
    console.log('Nova página aberta.');

    try {
        await page.setContent(htmlContent);
        console.log('Conteúdo HTML configurado.');

        await page.pdf({
            path: outputFile,
            width: '297mm',
            height: '420mm',
            margin: {
                top: '1cm',
                right: '1cm',
                bottom: '1cm',
                left: '1cm'
            },
        });

        console.log(`PDF gerado com sucesso em: ${outputFile}`);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
    } finally {
        await browser.close();
        console.log('Browser fechado.');
    }
}

// Inicia o servidor principal do Express;
app.whenReady().then(() => {
    appExpress.listen(PORT, () => {
        console.log(`Servidor está rodando na porta ${PORT}`);
        createWindow();
        verificar_versao();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

var versao = '1.0.0'

function verificar_versao() {
    var url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=versao';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(data => {
            if (data['versao'] != versao) {
                baixarEInstalar(data['link']);
                console.log(data['link'])
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}

function baixarEInstalar(link) {
    const filePath = path.join(app.getPath('temp'), 'nova-versao.exe');

    // Baixa o arquivo
    https.get(link, (response) => {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);

        file.on('finish', () => {
            file.close(() => {
                const options = {
                    name: 'SeuAplicativo',
                    icns: path.join(__dirname, 'icon.icns'), // (optional) Usado no MacOS
                };

                // Executa o instalador com privilégios de administrador
                sudo.exec(filePath, options, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Erro ao instalar a nova versão:', error);
                    } else {
                        console.log('Resultado:', stdout);
                        // Fecha o aplicativo após a instalação
                        app.quit();
                    }
                });
            });
        });

        file.on('error', (err) => {
            fs.unlink(filePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Erro ao remover o arquivo:', unlinkError);
                }
            });
            console.error('Erro ao baixar o arquivo:', err);
        });
    });
}

// Handle the save-dialog event
ipcMain.on('save-dialog', async (event, { htmlContent, nomeArquivo }) => {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Salvar PDF',
        defaultPath: path.join(app.getPath('desktop'), `${nomeArquivo}_${Date.now()}.pdf`),
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] }
        ]
    });

    if (filePath) {
        await generatePDF(htmlContent, filePath);
        event.reply('save-dialog-reply', 'PDF salvo com sucesso.');
    } else {
        event.reply('save-dialog-reply', 'Salvamento cancelado.');
    }
});
