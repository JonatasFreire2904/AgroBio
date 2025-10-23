// Script para inserir dados de demonstração
const db = require('../src/db');
const bcrypt = require('bcrypt');

async function insertDemoData() {
    try {
        console.log('Inserindo dados de demonstração...');

        // Inserir usuário de demonstração
        const password_hash = await bcrypt.hash('123456', 10);
        
        const [userId] = await db('users').insert({
            name: 'Jonatas Freire',
            email: 'jonatas@email.com',
            password_hash: password_hash,
            role: 'rural',
            city: 'Belo Horizonte',
            state: 'MG'
        });

        console.log('Usuário criado com ID:', userId);

        // Inserir algumas ofertas de exemplo
        await db('residues').insert([
            {
                user_id: userId,
                title: 'Palha de Cana-de-Açúcar',
                description: 'Palha de cana-de-açúcar de alta qualidade, ideal para produção de biocombustível',
                quantity: 50,
                unit: 'toneladas',
                location_city: 'Belo Horizonte',
                location_state: 'MG'
            },
            {
                user_id: userId,
                title: 'Bagasso de Cana',
                description: 'Bagasso de cana-de-açúcar processado, pronto para uso',
                quantity: 30,
                unit: 'toneladas',
                location_city: 'Belo Horizonte',
                location_state: 'MG'
            },
            {
                user_id: userId,
                title: 'Resíduos de Milho',
                description: 'Resíduos de milho verde, excelente para produção de etanol',
                quantity: 25,
                unit: 'toneladas',
                location_city: 'Belo Horizonte',
                location_state: 'MG'
            }
        ]);

        console.log('Ofertas de exemplo criadas');

        // Inserir usuário produtor de biocombustível
        const [bioUserId] = await db('users').insert({
            name: 'Maria Santos',
            email: 'maria@email.com',
            password_hash: password_hash,
            role: 'biocombustivel',
            city: 'Campinas',
            state: 'SP'
        });

        console.log('Usuário de biocombustível criado com ID:', bioUserId);

        // Inserir algumas negociações de exemplo
        await db('negotiations').insert([
            {
                residue_id: 1,
                buyer_id: bioUserId,
                seller_id: userId,
                message: 'Tenho interesse em negociar esta palha de cana. Podemos conversar sobre preço e entrega?',
                status: 'pending'
            }
        ]);

        console.log('Negociações de exemplo criadas');
        console.log('Dados de demonstração inseridos com sucesso!');

    } catch (error) {
        console.error('Erro ao inserir dados de demonstração:', error);
    } finally {
        process.exit();
    }
}

insertDemoData();
