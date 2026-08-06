// Centralized State Management with Multi-Tenancy for Nexus CRM
let state = {
    currentEnv: "", // Central login env
    privacyMode: false,
    calendarDate: new Date("2026-07-12"),
    pipelineViewMode: "kanban", // "kanban" or "funnel"
    activeFunnelSegment: "top", // "top", "mid", "bottom"
    environments: {}
};

// Default Catalogs
const defaultProducts = [
    { id: "p1", name: "Criação de Site Profissional", description: "Landing page ou site institucional de alto desempenho, responsivo e otimizado para SEO.", price: 3500.00, cost: 250.00, type: "single", suggestedAddons: ["p5", "p6", "p8"] },
    { id: "p2", name: "Desenvolvimento E-commerce", description: "Loja virtual completa com meios de pagamento integrados e gerenciador de estoque.", price: 7500.00, cost: 500.00, type: "single", suggestedAddons: ["p3", "p5", "p6", "p8"] },
    { id: "p3", name: "Gestão de Google Ads", description: "Campanhas otimizadas de tráfego pago no Google para captação diária de leads qualificados.", price: 1200.00, cost: 100.00, type: "monthly", suggestedAddons: [] },
    { id: "p4", name: "Otimização de Velocidade & SEO", description: "Otimização técnica para carregar em <1s e subir no ranking de buscas do Google.", price: 1800.00, cost: 150.00, type: "single", suggestedAddons: [] },
    { id: "p5", name: "Suporte & Manutenção Mensal", description: "Backups semanais, atualizações de segurança e suporte para alterações no site.", price: 350.00, cost: 50.00, type: "monthly", suggestedAddons: [] },
    { id: "p6", name: "Hospedagem Cloud Pro", description: "Servidor cloud VPS dedicado de alto desempenho com CDN Cloudflare ativa.", price: 90.00, cost: 35.00, type: "monthly", suggestedAddons: [] },
    { id: "p7", name: "Hospedagem Cloud Basic", description: "Servidor compartilhado padrão para sites de baixo tráfego.", price: 49.00, cost: 15.00, type: "monthly", suggestedAddons: [] },
    { id: "p8", name: "Registro & Renovação de Domínio", description: "Registro e renovação anual de domínio (.com.br / .com). Custo Registro.br: R$ 40,00 | Cobrado: R$ 50,00 (Lucro R$ 10,00/ano).", price: 50.00, cost: 40.00, type: "yearly", suggestedAddons: [] }
];

const defaultAffiliates = [
    {
        "id": "aff_default_1",
        "name": "Carlos Oliveira Marketing",
        "code": "CARLOS10",
        "email": "carlos.oliveira@marketingdigital.com",
        "phone": "(11) 98777-6655",
        "document": "342.189.908-12",
        "commissionRate": 3,
        "pixKey": "carlos.oliveira@marketingdigital.com",
        "bankInfo": "Banco Itaú - Ag 0451 C/C 23890-1",
        "discountBenefit": "10% de desconto na hospedagem ou 1º mês grátis",
        "status": "active",
        "createdAt": "2026-07-15T10:00:00.000Z",
        "payouts": [
            {
                "id": "pay_1",
                "amount": 150,
                "date": "2026-07-28T14:30:00.000Z",
                "receipt": "PIX-E3429012"
            }
        ]
    },
    {
        "id": "aff_default_2",
        "name": "Fernanda Lima Consultoria",
        "code": "FERNANDA2026",
        "email": "fernanda@limaconsultoria.com.br",
        "phone": "(11) 97111-2233",
        "document": "28.912.456/0001-99",
        "commissionRate": 2.5,
        "pixKey": "28.912.456/0001-99",
        "bankInfo": "Banco Bradesco - Ag 1204 C/C 8901-2",
        "discountBenefit": "1º mês de manutenção grátis",
        "status": "active",
        "createdAt": "2026-07-20T11:20:00.000Z",
        "payouts": []
    }
];

const defaultDocuments = [
    {
        "id": "doc_briefing_cliente_site_2026",
        "title": "Formulário de Briefing para Criação de Site (Preenchimento do Cliente)",
        "category": "contrato",
        "description": "Formulário oficial de coleta de dados para envio ao cliente. Contém todos os campos para o cliente preencher sobre a empresa dele: Nome, Slogan, Logo, Paleta de Cores, WhatsApp, E-mail, Redes Sociais, Serviços e Fotos.",
        "fileName": "Briefing_Criacao_de_Site_Cliente.pdf",
        "fileType": "application/pdf",
        "tags": "briefing, formulario cliente, criacao de site, dados cliente, contrato, logo, whatsapp, cores",
        "fileSize": 45000,
        "fileData": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaW5kcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggMzUwID4+CnN0cmVhbQpCVAovRjEgMTggVGYKNTAgNzIwIFRkCihGb3JtdWzDoXJpbyBkZSBCcmllZmluZyBwYXJhIENyaWHDp8OjbyBkZSBTaXRlIENsaWVudGUpIFRqCi9GMSAxMiBUZgowIC0zMCBUZAooV0VCQ08gQWdlbmN5IC0gU29sdWNvZXMgRGlnaXRhaXMgJiBDcmlhY2FvIGRlIFNpdGVzKSBUagowIC00MCBUZAooRm9ybXVsw6FyaW8gb2ZpY2lhbCBkZSBjb2xldGEgZGUgZGFkb3MgcGFyYSBlbnZpbyBhbyBjbGllbnRlLiBOb21lLCBTbG9nYW4sIExvZ28sKSBUagowIC0yMCBUZAooIFBhbGV0YSBkZSBDb3JlcywgV2hhdHNBcHAgZSBTZXJ2acOnb3MuKSBUagowIC00MCBUZAooQ29udGF0bzogbWF0aGV1c2JlbGxhdG8yM0B3ZWJjb2FnZW5jeS5zaXRlIHwgV2hhdHNBcHA6IDExIDkxODE0LTcyNzcpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NCAwMDAwMCBuIAowMDAwMDAwNTUwIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNjI1CiUlRU9G",
        "createdAt": "2026-07-31T10:45:00.000Z"
    },
    {
        "id": "doc_webco_checklist_site_2026",
        "title": "Checklist & Briefing Completo para Criação de Sites - WEBCO Agency",
        "category": "contrato",
        "description": "Guia definitivo e checklist oficial com todos os itens necessários para desenvolvimento de sites profissionais (Identidade Visual, Paleta de Cores, Logo, Banner, WhatsApp, E-mail, Redes Sociais, Domínio e Estrutura de Páginas).",
        "fileName": "Checklist_Briefing_Criacao_de_Site_WEBCO.pdf",
        "fileType": "application/pdf",
        "tags": "checklist, briefing, site, webco, logo, paleta, whatsapp, email, dominio, contrato",
        "fileSize": 48000,
        "fileData": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaW5kcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggMzQxID4+CnN0cmVhbQpCVAovRjEgMTggVGYKNTAgNzIwIFRkCihDaGVja2xpc3QgJiBCcmllZmluZyBDb21wbGV0byBwYXJhIENyaWHDp8OjbyBkZSBTaXRlcykgVGoKL0YxIDEyIFRmCjAgLTMwIFRkCihXRUJDTyBBZ2VuY3kgLSBTb2x1Y29lcyBEaWdpdGFpcyAmIENyaWFjYW8gZGUgU2l0ZXMpIFRqCjAgLTQwIFRkCihHdWlhIGRlZmluaXRpdm8gZSBjaGVja2xpc3Qgb2ZpY2lhbCBjb20gdG9kb3Mgb3MgaXRlbnMgbmVjZXNzw6FyaW9zIHBhcmEgZGVzZW52b2wpIFRqCjAgLTIwIFRkCih2aW1lbnRvIGRlIHNpdGVzIHByb2Zpc3Npb25haXMuKSBUagowIC00MCBUZAooQ29udGF0bzogbWF0aGV1c2JlbGxhdG8yM0B3ZWJjb2FnZW5jeS5zaXRlIHwgV2hhdHNBcHA6IDExIDkxODE0LTcyNzcpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NCAwMDAwMCBuIAowMDAwMDAwNTUwIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNjI1CiUlRU9G",
        "createdAt": "2026-07-31T10:00:00.000Z"
    },
    {
        "id": "doc_default_1",
        "title": "Proposta Comercial Padrão - WEBCO 2026",
        "category": "proposta",
        "description": "Modelo oficial de proposta comercial para desenvolvimento de sites profissionais, landing pages e soluções digitais.",
        "fileName": "Proposta_Comercial_WEBCO_2026.pdf",
        "fileType": "application/pdf",
        "tags": "proposta, comercial, pdf, sites",
        "fileSize": 52000,
        "fileData": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaW5kcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggMzMzID4+CnN0cmVhbQpCVAovRjEgMTggVGYKNTAgNzIwIFRkCihQcm9wb3N0YSBDb21lcmNpYWwgUGFkcsOjbyAtIFdFQkNPIDIwMjYpIFRqCi9GMSAxMiBUZgowIC0zMCBUZAooV0VCQ08gQWdlbmN5IC0gU29sdWNvZXMgRGlnaXRhaXMgJiBDcmlhY2FvIGRlIFNpdGVzKSBUagowIC00MCBUZAooTW9kZWxvIG9maWNpYWwgZGUgcHJvcG9zdGEgY29tZXJjaWFsIHBhcmEgZGVzZW52b2x2aW1lbnRvIGRlIHNpdGVzIHByb2Zpc3Npb25haXMpIFRqCjAgLTIwIFRkCigsIGxhbmRpbmcgcGFnZXMgZSBzb2x1w6fDtWVzIGRpZ2l0YWlzLikgVGoKMCAtNDAgVGQKKENvbnRhdG86IG1hdGhldXNiZWxsYXRvMjNAd2ViY29hZ2VuY3kuc2l0ZSB8IFdoYXRzQXBwOiAxMSA5MTgxNC03Mjc3KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDQgMDAwMDAgbiAKMDAwMDAwMDU1MCAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjYyNQolJUVPRg==",
        "createdAt": "2026-07-30T10:00:00.000Z"
    },
    {
        "id": "doc_default_2",
        "title": "Portfólio de Cases & Projetos WEBCO",
        "category": "portfolio",
        "description": "Apresentação visual com principais cases de sucesso, métricas de resultados e telas de sites desenvolvidos.",
        "fileName": "Portfolio_Cases_WEBCO.pdf",
        "fileType": "application/pdf",
        "tags": "portfolio, cases, apresentacao, webco",
        "fileSize": 55000,
        "fileData": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaW5kcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggMzIxID4+CnN0cmVhbQpCVAovRjEgMTggVGYKNTAgNzIwIFRkCihQb3J0ZsOzbGlvIGRlIENhc2VzICYgUHJvamV0b3MgV0VCQ08pIFRqCi9GMSAxMiBUZgowIC0zMCBUZAooV0VCQ08gQWdlbmN5IC0gU29sdWNvZXMgRGlnaXRhaXMgJiBDcmlhY2FvIGRlIFNpdGVzKSBUagowIC00MCBUZAooQXByZXNlbnRhw6fDo28gdmlzdWFsIGNvbSBwcmluY2lwYWlzIGNhc2VzIGRlIHN1Y2Vzc28sIG3DqXRyaWNhcyBkZSByZXN1bHRhZG9zIGUgdGUpIFRqCjAgLTIwIFRkCihsYXMgZGUgc2l0ZXMgZGVzZW52b2x2aWRvcy4pIFRqCjAgLTQwIFRkCihDb250YXRvOiBtYXRoZXVzYmVsbGF0bzIzQHdlYmNvYWdlbmN5LnNpdGUgfCBXaGF0c0FwcDogMTEgOTE4MTQtNzI3NykgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQ0IDAwMDAwIG4gCjAwMDAwMDA1NTAgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo2MjUKJSVFT0Y=",
        "createdAt": "2026-07-30T10:30:00.000Z"
    }
];

const defaultContacts = [
    {
        "id": "c_agente_1785464786550_p521",
        "name": "Mine",
        "company": "Mine",
        "email": "",
        "phone": "(11) 97570-2321",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Lead importado manualmente em 17/07/2026, 15:06:27",
        "source": "Agente Comercial",
        "createdAt": "2026-07-17T18:06:27.677Z",
        "timeline": [
            {
                "id": "act_1785464786550",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.550Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_j1b5",
        "name": "Gráfica Rápida Profissional Copacabana Zona Sul Barata Ribeiro",
        "company": "Gráfica Rápida Profissional Copacabana Zona Sul Barata Ribeiro",
        "email": "",
        "phone": "(21) 2549-2815",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_qaqh",
        "name": "TAG • GRÁFICA RÁPIDA Copacabana",
        "company": "TAG • GRÁFICA RÁPIDA Copacabana",
        "email": "",
        "phone": "(21) 2227-1216",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_1lfe",
        "name": "Gráfica ServPrint Barra Funda",
        "company": "Gráfica ServPrint Barra Funda",
        "email": "",
        "phone": "(11) 98783-9772",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (HTTP 400)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_hgc4",
        "name": "Gráfica Ghds",
        "company": "Gráfica Ghds",
        "email": "",
        "phone": "(11) 99431-0120",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_nc5g",
        "name": "GráFica Em Osasco 24 Horas",
        "company": "GráFica Em Osasco 24 Horas",
        "email": "",
        "phone": "(11) 96292-0303",
        "niche": "Gráfica",
        "status": "proposal",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_dzt2",
        "name": "Teck Prints",
        "company": "Teck Prints",
        "email": "",
        "phone": "(11) 3688-1122",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_kyz2",
        "name": "CardPress Barra Funda",
        "company": "CardPress Barra Funda",
        "email": "",
        "phone": "(11) 2626-1369",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_4cmz",
        "name": "Gráfica Rápida Aquarela",
        "company": "Gráfica Rápida Aquarela",
        "email": "",
        "phone": "(11) 3681-1402",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_vktq",
        "name": "Leograf Gráfica Editora",
        "company": "Leograf Gráfica Editora",
        "email": "",
        "phone": "(11) 3658-5000",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Copyright antigo (2020))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_26qv",
        "name": "Click Cópias e Serviços",
        "company": "Click Cópias e Serviços",
        "email": "",
        "phone": "(11) 3683-6191",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_raxn",
        "name": "Copiadora Charlie Osasco",
        "company": "Copiadora Charlie Osasco",
        "email": "",
        "phone": "(11) 3684-0333",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_jqtk",
        "name": "HL Acabamentos Gráficos",
        "company": "HL Acabamentos Gráficos",
        "email": "",
        "phone": "(11) 4346-2000",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_excv",
        "name": "Fusão Impressão Digital",
        "company": "Fusão Impressão Digital",
        "email": "",
        "phone": "(11) 3616-2000",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_8iri",
        "name": "Central de Cópias do Brasil",
        "company": "Central de Cópias do Brasil",
        "email": "",
        "phone": "(11) 97392-7162",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_xqr0",
        "name": "DJP Gráfica e Sublimação",
        "company": "DJP Gráfica e Sublimação",
        "email": "",
        "phone": "(11) 97724-8068",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_r8bt",
        "name": "Shigueko Gráfica Adesivos e Carimbos",
        "company": "Shigueko Gráfica Adesivos e Carimbos",
        "email": "",
        "phone": "(11) 95425-1176",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_qb3w",
        "name": "Copyfast",
        "company": "Copyfast",
        "email": "",
        "phone": "(11) 4624-0030",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_xmra",
        "name": "Braspor Gráfica Editora",
        "company": "Braspor Gráfica Editora",
        "email": "",
        "phone": "(11) 3601-2226",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_dmsb",
        "name": "Grafix",
        "company": "Grafix",
        "email": "",
        "phone": "(11) 97787-3991",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_3zs2",
        "name": "Ideal SoluçõEs Digitais",
        "company": "Ideal SoluçõEs Digitais",
        "email": "",
        "phone": "(11) 97641-6641",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_gspm",
        "name": "GVH Gráfica Online",
        "company": "GVH Gráfica Online",
        "email": "",
        "phone": "(11) 98456-6956",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_t7dp",
        "name": "Rei dos Panfletos",
        "company": "Rei dos Panfletos",
        "email": "",
        "phone": "(11) 3683-5127",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_t3d6",
        "name": "Dinu's Artes Gráficas",
        "company": "Dinu's Artes Gráficas",
        "email": "",
        "phone": "(11) 3683-4488",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_6w2x",
        "name": "Grafica Osasco Colors",
        "company": "Grafica Osasco Colors",
        "email": "",
        "phone": "(11) 95283-3700",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_pb1i",
        "name": "Gráfica JF Impressão Digital (em Osasco",
        "company": "Gráfica JF Impressão Digital (em Osasco",
        "email": "",
        "phone": "(11) 98119-2357",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_7k5z",
        "name": "MB Gráfica",
        "company": "MB Gráfica",
        "email": "",
        "phone": "(11) 3685-4951",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_o77p",
        "name": "Gráfica Artself",
        "company": "Gráfica Artself",
        "email": "",
        "phone": "(11) 98868-8050",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_i3nb",
        "name": "ENLUMOS fotografia e presentes",
        "company": "ENLUMOS fotografia e presentes",
        "email": "",
        "phone": "(11) 97708-1715",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_493p",
        "name": "Gráfica FuturaIM (Unidade Osasco)",
        "company": "Gráfica FuturaIM (Unidade Osasco)",
        "email": "",
        "phone": "(11) 3654-1571",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_rfhe",
        "name": "Gráfica Yara",
        "company": "Gráfica Yara",
        "email": "",
        "phone": "(11) 3681-6590",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_kz5e",
        "name": "Gráfica Jatobá",
        "company": "Gráfica Jatobá",
        "email": "",
        "phone": "(11) 3682-3287",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_garx",
        "name": "Artes Graficas Freire",
        "company": "Artes Graficas Freire",
        "email": "",
        "phone": "(11) 3699-1112",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_mnzr",
        "name": "Gráfica Pinheiros Visual Pro Experience",
        "company": "Gráfica Pinheiros Visual Pro Experience",
        "email": "",
        "phone": "(11) 96188-1742",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_ty6a",
        "name": "Gráficas Mazal",
        "company": "Gráficas Mazal",
        "email": "",
        "phone": "(11) 99764-9852",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_hxiw",
        "name": "Suba Print",
        "company": "Suba Print",
        "email": "",
        "phone": "(11) 94535-5555",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_6biw",
        "name": "Gráfica Luma",
        "company": "Gráfica Luma",
        "email": "",
        "phone": "(11) 3672-5077",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_4ock",
        "name": "Olhartístico Digital",
        "company": "Olhartístico Digital",
        "email": "",
        "phone": "(11) 93335-1194",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_99gs",
        "name": "Color Digital Gráfica",
        "company": "Color Digital Gráfica",
        "email": "",
        "phone": "(11) 2779-5041",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Copyright antigo (2020))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_24mc",
        "name": "impressão de apostilas",
        "company": "impressão de apostilas",
        "email": "",
        "phone": "(11) 96787-5519",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_8nsm",
        "name": "Gráfica Critério",
        "company": "Gráfica Critério",
        "email": "",
        "phone": "(11) 3064-3992",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_rw8a",
        "name": "Postnet Perdizes",
        "company": "Postnet Perdizes",
        "email": "",
        "phone": "(11) 2506-7888",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_dpz1",
        "name": "Impressão e encadernação",
        "company": "Impressão e encadernação",
        "email": "",
        "phone": "(11) 3807-7562",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_lu24",
        "name": "Datanew",
        "company": "Datanew",
        "email": "",
        "phone": "(11) 3871-0227",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_199n",
        "name": "Best Design Gráfica Digital",
        "company": "Best Design Gráfica Digital",
        "email": "",
        "phone": "(11) 96609-4310",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_v2cl",
        "name": "GR Soluções Gráficas",
        "company": "GR Soluções Gráficas",
        "email": "",
        "phone": "(11) 3675-3948",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_0td5",
        "name": "Imax Digital Gráfica Rápida e Com. Visual",
        "company": "Imax Digital Gráfica Rápida e Com. Visual",
        "email": "",
        "phone": "(11) 98275-9009",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_rn78",
        "name": "Copy Set Gráfica e Copiadora",
        "company": "Copy Set Gráfica e Copiadora",
        "email": "",
        "phone": "(11) 3812-5058",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (HTTP 400)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_m1qx",
        "name": "Forte Papelaria e Copiadora",
        "company": "Forte Papelaria e Copiadora",
        "email": "",
        "phone": "(11) 95453-1456",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_meud",
        "name": "CartõEs De Natal",
        "company": "CartõEs De Natal",
        "email": "",
        "phone": "(11) 98180-9901",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_or2s",
        "name": "Futaba Impressão Digital",
        "company": "Futaba Impressão Digital",
        "email": "",
        "phone": "(11) 97305-3032",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_sqnc",
        "name": "Cópias e Serviços Pinheiros",
        "company": "Cópias e Serviços Pinheiros",
        "email": "",
        "phone": "(11) 3814-0010",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_spxw",
        "name": "Print Tech Impressões Técnicas",
        "company": "Print Tech Impressões Técnicas",
        "email": "",
        "phone": "(11) 3872-2118",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (Instável/Fora do ar)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_i7rw",
        "name": "Papiro Gráfica Rápida e Papelaria",
        "company": "Papiro Gráfica Rápida e Papelaria",
        "email": "",
        "phone": "(11) 3673-2868",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_l808",
        "name": "AroPrint",
        "company": "AroPrint",
        "email": "",
        "phone": "(11) 3816-0459",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_tt0u",
        "name": "Ggraf",
        "company": "Ggraf",
        "email": "",
        "phone": "(11) 3062-4251",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_yw12",
        "name": "Fortrox Copiadora & Gráfica Digital",
        "company": "Fortrox Copiadora & Gráfica Digital",
        "email": "",
        "phone": "(11) 3062-2814",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_jl6v",
        "name": "Imprimix Pinheiros",
        "company": "Imprimix Pinheiros",
        "email": "",
        "phone": "(11) 99943-4554",
        "niche": "Gráfica",
        "status": "proposal",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_mlnl",
        "name": "Think About",
        "company": "Think About",
        "email": "",
        "phone": "(11) 3675-6477",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_ruq9",
        "name": "Gráfica Primeira",
        "company": "Gráfica Primeira",
        "email": "",
        "phone": "(11) 3863-2082",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_er9w",
        "name": "Digital Brigido",
        "company": "Digital Brigido",
        "email": "",
        "phone": "(11) 3032-1124",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_wqo9",
        "name": "West Copy",
        "company": "West Copy",
        "email": "",
        "phone": "(11) 3676-1401",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_82ad",
        "name": "Comprint Máquinas e Materiais Gráficos",
        "company": "Comprint Máquinas e Materiais Gráficos",
        "email": "",
        "phone": "(11) 3371-3371",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_y84g",
        "name": "Grafiset Cópias",
        "company": "Grafiset Cópias",
        "email": "",
        "phone": "(11) 3085-1666",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_8a15",
        "name": "Starting Copias Express",
        "company": "Starting Copias Express",
        "email": "",
        "phone": "(11) 95351-9669",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_ht79",
        "name": "Color Art",
        "company": "Color Art",
        "email": "",
        "phone": "(11) 3801-2421",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_wi2r",
        "name": "LCM Indústria e Comércio",
        "company": "LCM Indústria e Comércio",
        "email": "",
        "phone": "(19) 97405-9945",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_g96b",
        "name": "Gráfica HDprint (Gráfica Rápida",
        "company": "Gráfica HDprint (Gráfica Rápida",
        "email": "",
        "phone": "(11) 2892-2327",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_rgnq",
        "name": "Print Copy",
        "company": "Print Copy",
        "email": "",
        "phone": "(11) 3031-0922",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_db8b",
        "name": "Novimaq Conveniência Gráfica",
        "company": "Novimaq Conveniência Gráfica",
        "email": "",
        "phone": "(11) 3862-1541",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_w5pp",
        "name": "Idéia Ação Comércio e Serviços",
        "company": "Idéia Ação Comércio e Serviços",
        "email": "",
        "phone": "(11) 3873-2164",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_c93z",
        "name": "AlphaGraphics Pinheiros",
        "company": "AlphaGraphics Pinheiros",
        "email": "",
        "phone": "(11) 3035-3700",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_g94y",
        "name": "Symposion Gráfica e Encadernadora",
        "company": "Symposion Gráfica e Encadernadora",
        "email": "",
        "phone": "(11) 3672-2804",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_5mq1",
        "name": "Cyan Artes Gráficas",
        "company": "Cyan Artes Gráficas",
        "email": "",
        "phone": "(11) 97336-3008",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_rvlw",
        "name": "Visual Print",
        "company": "Visual Print",
        "email": "",
        "phone": "(11) 3031-3985",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_nofy",
        "name": "Uniplotagem e Cópias",
        "company": "Uniplotagem e Cópias",
        "email": "",
        "phone": "(11) 2628-1944",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.552Z",
        "timeline": [
            {
                "id": "act_1785464786552",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.552Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786552_p2pz",
        "name": "Planet Cop",
        "company": "Planet Cop",
        "email": "",
        "phone": "(11) 2872-9531",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_av25",
        "name": "Four Cópias Plotagens",
        "company": "Four Cópias Plotagens",
        "email": "",
        "phone": "(11) 3816-1122",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_1g6v",
        "name": "Master Copy",
        "company": "Master Copy",
        "email": "",
        "phone": "(11) 94226-3400",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_rs91",
        "name": "Lazuli Editora",
        "company": "Lazuli Editora",
        "email": "",
        "phone": "(11) 3729-6077",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_ysud",
        "name": "InPrima Soluções Gráficas",
        "company": "InPrima Soluções Gráficas",
        "email": "",
        "phone": "(11) 4858-3180",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_oqm2",
        "name": "CPVisual",
        "company": "CPVisual",
        "email": "",
        "phone": "(11) 3061-3760",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_c0h8",
        "name": "Banner Adesivo Placas Faixas Serviços gráficos Ponto7 SP",
        "company": "Banner Adesivo Placas Faixas Serviços gráficos Ponto7 SP",
        "email": "",
        "phone": "(11) 3037-7196",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_ytab",
        "name": "Diana Cecchini Vendas Gráfica",
        "company": "Diana Cecchini Vendas Gráfica",
        "email": "",
        "phone": "(11) 98539-4863",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_ubqr",
        "name": "Copy House",
        "company": "Copy House",
        "email": "",
        "phone": "(21) 2508-6000",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_vfxh",
        "name": "PGW Gráfica",
        "company": "PGW Gráfica",
        "email": "",
        "phone": "(11) 95370-9104",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (Instável/Fora do ar)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_o6n9",
        "name": "AcriMundi Cortes e Gravações a Laser",
        "company": "AcriMundi Cortes e Gravações a Laser",
        "email": "",
        "phone": "(11) 98912-3375",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (Instável/Fora do ar)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_0i0a",
        "name": "SCP Papelaria",
        "company": "SCP Papelaria",
        "email": "",
        "phone": "(11) 98631-9362",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_rbbq",
        "name": "Copiadora Engecopy Comécio",
        "company": "Copiadora Engecopy Comécio",
        "email": "",
        "phone": "(11) 3097-0107",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_40ba",
        "name": "Escripel Papelaria e Informática",
        "company": "Escripel Papelaria e Informática",
        "email": "",
        "phone": "(11) 2359-2501",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_55mm",
        "name": "RA Paper",
        "company": "RA Paper",
        "email": "",
        "phone": "(11) 93224-6287",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_95zt",
        "name": "Carimbo Letterpress",
        "company": "Carimbo Letterpress",
        "email": "",
        "phone": "(11) 3494-6788",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_i4sf",
        "name": "Artur Cópias",
        "company": "Artur Cópias",
        "email": "",
        "phone": "(11) 3032-0677",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_l0ro",
        "name": "Prata Design Gráfico",
        "company": "Prata Design Gráfico",
        "email": "",
        "phone": "(11) 3023-1569",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_4rww",
        "name": "Comunika Visual",
        "company": "Comunika Visual",
        "email": "",
        "phone": "(11) 98198-8580",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_itli",
        "name": "Gráfica Rápida Jundiaí",
        "company": "Gráfica Rápida Jundiaí",
        "email": "",
        "phone": "(11) 97305-9611",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_97z1",
        "name": "Gráfica Jundiaí",
        "company": "Gráfica Jundiaí",
        "email": "",
        "phone": "(11) 4817-7382",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (Instável/Fora do ar)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_75mr",
        "name": "Gráfica PoliSet",
        "company": "Gráfica PoliSet",
        "email": "",
        "phone": "(11) 3379-2430",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_867u",
        "name": "Gráfica Rápida Max",
        "company": "Gráfica Rápida Max",
        "email": "",
        "phone": "(11) 95426-1143",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_hw2u",
        "name": "Maltoni",
        "company": "Maltoni",
        "email": "",
        "phone": "(11) 4521-4573",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_pnux",
        "name": "Gráfica Imprima 1000",
        "company": "Gráfica Imprima 1000",
        "email": "",
        "phone": "(11) 91720-8873",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_dfle",
        "name": "JundGraph",
        "company": "JundGraph",
        "email": "",
        "phone": "(11) 4586-9756",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_yegq",
        "name": "Mettagraf",
        "company": "Mettagraf",
        "email": "",
        "phone": "(11) 4584-0894",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_rz11",
        "name": "Gráfica Art Cartões",
        "company": "Gráfica Art Cartões",
        "email": "",
        "phone": "(11) 96393-9769",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Copyright antigo (2021))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_ynhl",
        "name": "Firstweb Gráfica e Brindes",
        "company": "Firstweb Gráfica e Brindes",
        "email": "",
        "phone": "(11) 3379-7848",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_0dlg",
        "name": "Copiadora Jundiaí",
        "company": "Copiadora Jundiaí",
        "email": "",
        "phone": "(11) 99486-7491",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_5sxm",
        "name": "Impressos Jundiaí",
        "company": "Impressos Jundiaí",
        "email": "",
        "phone": "(11) 97465-5557",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (HTTP 403)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_2mf2",
        "name": "ChromoArte Gráfica & Comunicação Visual",
        "company": "ChromoArte Gráfica & Comunicação Visual",
        "email": "",
        "phone": "(11) 4582-0886",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_1n69",
        "name": "Gráfica Visão",
        "company": "Gráfica Visão",
        "email": "",
        "phone": "(11) 97144-0298",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_0d80",
        "name": "Razor Digital Gráfica Rápida",
        "company": "Razor Digital Gráfica Rápida",
        "email": "",
        "phone": "(11) 98904-8308",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Copyright antigo (2022))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_hw12",
        "name": "Jet Printer Jundiaí",
        "company": "Jet Printer Jundiaí",
        "email": "",
        "phone": "(11) 95411-2646",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_qk2w",
        "name": "Gráfica Setembro",
        "company": "Gráfica Setembro",
        "email": "",
        "phone": "(11) 99415-4366",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Copyright antigo (2022))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_81uj",
        "name": "Gráfica L'Two *",
        "company": "Gráfica L'Two *",
        "email": "",
        "phone": "(11) 97338-9143",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_6l1x",
        "name": "Seleto Print",
        "company": "Seleto Print",
        "email": "",
        "phone": "(11) 94555-4700",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_1dl7",
        "name": "Litografia Bandeirantes",
        "company": "Litografia Bandeirantes",
        "email": "",
        "phone": "(11) 4585-5252",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_oad7",
        "name": "Gráfica Apollo",
        "company": "Gráfica Apollo",
        "email": "",
        "phone": "(11) 4587-5248",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_tymp",
        "name": "Giton ComunicaçãO",
        "company": "Giton ComunicaçãO",
        "email": "",
        "phone": "(11) 97510-2321",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_8nyb",
        "name": "Dani Artes",
        "company": "Dani Artes",
        "email": "",
        "phone": "(11) 97143-2657",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_r9vw",
        "name": "Gráfica RCA",
        "company": "Gráfica RCA",
        "email": "",
        "phone": "(11) 97225-6537",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_wvsz",
        "name": "Grafica Mil Coisas Personalizadas",
        "company": "Grafica Mil Coisas Personalizadas",
        "email": "",
        "phone": "(11) 94736-5488",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_wsuu",
        "name": "Luma Sign",
        "company": "Luma Sign",
        "email": "",
        "phone": "(11) 4582-1623",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_e4to",
        "name": "Pixel Gráfica e Personalizados",
        "company": "Pixel Gráfica e Personalizados",
        "email": "",
        "phone": "(11) 97472-5593",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_kaas",
        "name": "Gráfica Blooprint",
        "company": "Gráfica Blooprint",
        "email": "",
        "phone": "(11) 97559-2299",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_lliv",
        "name": "Formatho Gráfica & Comunicação Visual",
        "company": "Formatho Gráfica & Comunicação Visual",
        "email": "",
        "phone": "(11) 4816-6003",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_dadw",
        "name": "Gráfica Armi",
        "company": "Gráfica Armi",
        "email": "",
        "phone": "(11) 98700-2745",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_lao6",
        "name": "Gráfica Abreu",
        "company": "Gráfica Abreu",
        "email": "",
        "phone": "(11) 4587-9051",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_mpy8",
        "name": "Gráfica Cartão Ouro",
        "company": "Gráfica Cartão Ouro",
        "email": "",
        "phone": "(11) 4521-5217",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_wuxq",
        "name": "Cartão Express",
        "company": "Cartão Express",
        "email": "",
        "phone": "(11) 97760-6300",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_2lhl",
        "name": "Libergraf Composições Gráficas",
        "company": "Libergraf Composições Gráficas",
        "email": "",
        "phone": "(11) 4587-0753",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_2nje",
        "name": "CSR Digital Print",
        "company": "CSR Digital Print",
        "email": "",
        "phone": "(11) 93907-2928",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_cclo",
        "name": "Sua Gráfica Express",
        "company": "Sua Gráfica Express",
        "email": "",
        "phone": "(11) 98271-2857",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_7x7t",
        "name": "Genius Print",
        "company": "Genius Print",
        "email": "",
        "phone": "(11) 99918-6837",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_he0v",
        "name": "Gráfica Imprimax Jundiaí",
        "company": "Gráfica Imprimax Jundiaí",
        "email": "",
        "phone": "(11) 98784-7224",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_9jld",
        "name": "Gráfica Leonel",
        "company": "Gráfica Leonel",
        "email": "",
        "phone": "(11) 4521-7653",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_9ew8",
        "name": "Volken",
        "company": "Volken",
        "email": "",
        "phone": "(11) 4587-8900",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_c03v",
        "name": "Beviarte",
        "company": "Beviarte",
        "email": "",
        "phone": "(11) 4607-9801",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_1st8",
        "name": "JunTor Gráfica",
        "company": "JunTor Gráfica",
        "email": "",
        "phone": "(11) 4587-8047",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_yar8",
        "name": "Gráfica Rápida Precisão",
        "company": "Gráfica Rápida Precisão",
        "email": "",
        "phone": "(11) 97709-4310",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_dind",
        "name": "Sonvia",
        "company": "Sonvia",
        "email": "",
        "phone": "(11) 92135-9988",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_kyme",
        "name": "ImpressoMix Serviços de Impressão",
        "company": "ImpressoMix Serviços de Impressão",
        "email": "",
        "phone": "(11) 3963-5530",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_seha",
        "name": "Jet Printer Maxi Shopping",
        "company": "Jet Printer Maxi Shopping",
        "email": "",
        "phone": "(11) 91448-9817",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_6drh",
        "name": "Digibanners Várzea Paulista",
        "company": "Digibanners Várzea Paulista",
        "email": "",
        "phone": "(11) 97194-4923",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_snjw",
        "name": "Digital Gráfica",
        "company": "Digital Gráfica",
        "email": "",
        "phone": "(11) 97056-9181",
        "niche": "Gráfica",
        "status": "contacted",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_yjly",
        "name": "Digibanners Comunicação Visual",
        "company": "Digibanners Comunicação Visual",
        "email": "",
        "phone": "(11) 96848-1695",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_46vx",
        "name": "DS Soluções Gráficas e Digitais",
        "company": "DS Soluções Gráficas e Digitais",
        "email": "",
        "phone": "(11) 91833-1122",
        "niche": "Gráfica",
        "status": "proposal",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_epdz",
        "name": "Nova Era Comunicação Visual",
        "company": "Nova Era Comunicação Visual",
        "email": "",
        "phone": "(11) 4584-4543",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_qwil",
        "name": "vitoria grafica e artes digitais",
        "company": "vitoria grafica e artes digitais",
        "email": "",
        "phone": "(11) 96310-9868",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_570u",
        "name": "Papyrus",
        "company": "Papyrus",
        "email": "",
        "phone": "(11) 4587-7014",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_loco",
        "name": "Printer Soluções e Plotagens",
        "company": "Printer Soluções e Plotagens",
        "email": "",
        "phone": "(11) 4805-1220",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_0iu9",
        "name": "Postnet",
        "company": "Postnet",
        "email": "",
        "phone": "(11) 3963-8023",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_arrj",
        "name": "Gráfica C.R.M",
        "company": "Gráfica C.R.M",
        "email": "",
        "phone": "(11) 4526-4851",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_63jt",
        "name": "Gráfica Blantes",
        "company": "Gráfica Blantes",
        "email": "",
        "phone": "(11) 99825-1369",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site desatualizado ou não responsivo (Não responsivo (sem viewport))",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_k2y0",
        "name": "PÉROLA Impressões e Cópias",
        "company": "PÉROLA Impressões e Cópias",
        "email": "",
        "phone": "(11) 97573-5602",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_xr44",
        "name": "Art Brasil",
        "company": "Art Brasil",
        "email": "",
        "phone": "(11) 4586-0624",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_mns4",
        "name": "Bellartes Gráfica",
        "company": "Bellartes Gráfica",
        "email": "",
        "phone": "(11) 4497-0556",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_2o3f",
        "name": "Gráfica Aliança",
        "company": "Gráfica Aliança",
        "email": "",
        "phone": "(11) 94434-4549",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_a33h",
        "name": "Grafica Fagian",
        "company": "Grafica Fagian",
        "email": "",
        "phone": "(11) 4587-6208",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_z2ta",
        "name": "Viz Print Gráfica Rápida e Personalizados",
        "company": "Viz Print Gráfica Rápida e Personalizados",
        "email": "",
        "phone": "(11) 99572-1162",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_c3h7",
        "name": "Gráfica 011",
        "company": "Gráfica 011",
        "email": "",
        "phone": "(11) 94150-2557",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (HTTP 400)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_qcce",
        "name": "Copiadora Rosário",
        "company": "Copiadora Rosário",
        "email": "",
        "phone": "(11) 4522-2364",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_n1sw",
        "name": "Rsc Impressão Digital",
        "company": "Rsc Impressão Digital",
        "email": "",
        "phone": "(11) 4607-4275",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site cadastrado no Maps está fora do ar (Instável/Fora do ar)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_7ky4",
        "name": "DSJ Comunicação Visual",
        "company": "DSJ Comunicação Visual",
        "email": "",
        "phone": "(11) 98570-5322",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_snq8",
        "name": "Grafor",
        "company": "Grafor",
        "email": "",
        "phone": "(11) 4533-1092",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Sem site no Google Maps",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_8n1n",
        "name": "Lenx Designer",
        "company": "Lenx Designer",
        "email": "",
        "phone": "(11) 96603-2754",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_dv1h",
        "name": "Intensa Arte",
        "company": "Intensa Arte",
        "email": "",
        "phone": "(11) 95555-7940",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_zr6d",
        "name": "Rm ComunicaçãO Visual",
        "company": "Rm ComunicaçãO Visual",
        "email": "",
        "phone": "(11) 4607-0252",
        "niche": "Gráfica",
        "status": "lost",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    },
    {
        "id": "c_agente_1785464786553_1ag4",
        "name": "Adesivos Pozzani",
        "company": "Adesivos Pozzani",
        "email": "",
        "phone": "(11) 94695-9990",
        "niche": "Gráfica",
        "status": "lead",
        "value": 400,
        "notes": "Site existente (avaliar qualidade)",
        "source": "Agente Comercial",
        "createdAt": "2026-07-31T02:26:26.553Z",
        "timeline": [
            {
                "id": "act_1785464786553",
                "type": "note",
                "description": "🤖 Lead importado do Agente Comercial AI.",
                "timestamp": "2026-07-31T02:26:26.553Z"
            }
        ]
    }
];

const defaultCustomers = [
    { id: "cust1", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Desenvolvimento E-commerce", value: 7500.00, type: "single", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust2", contactId: "c2", name: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Gestão de Google Ads", value: 1200.00, type: "monthly", status: "active", createdAt: "2026-07-09T18:12:00.000Z" },
    { id: "cust_parana_site", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
    { id: "cust_parana_update", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
    { id: "cust_parana_maint", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
    { id: "cust_parana_ads", contactId: "c_parana_ecoturismo", name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, type: "monthly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" }
];

const defaultTasks = [
    { id: "t1", title: "Enviar escopo do site para João Silva", contactId: "c1", dueDate: "2026-07-13", priority: "high", completed: false },
    { id: "t2", title: "Ligar para Carlos Souza sobre proposta", contactId: "c3", dueDate: "2026-07-15", priority: "medium", completed: false }
];

const defaultExpenses = [
    { id: "exp1", description: "Hospedagem AWS & CDN Cloudflare", category: "Infraestrutura", supplier: "AWS / Cloudflare", recurrence: "monthly", value: 250.00, date: "2026-07-01" },
    { id: "exp2", description: "Campanha Tráfego Pago Web Co.", category: "Marketing", supplier: "Google Ads", recurrence: "monthly", value: 1200.00, date: "2026-07-05" },
    { id: "exp3", description: "Assinatura Figma & Canva Pro", category: "Ferramentas", supplier: "Figma / Canva", recurrence: "monthly", value: 180.00, date: "2026-07-08" }
];

const defaultContractedServices = [
    { id: "svc1", name: "Google Workspace Pro", category: "SaaS", supplier: "Google", value: 120.00, recurrence: "monthly", nextDue: "2026-08-05", status: "active", notes: "Contas de e-mail corporativo da equipe" },
    { id: "svc2", name: "Servidor Cloud VPS Hostinger", category: "Infraestrutura", supplier: "Hostinger", value: 180.00, recurrence: "monthly", nextDue: "2026-08-10", status: "active", notes: "Hospedagem VPS de alta performance dos sites" },
    { id: "svc3", name: "Notion & Figma Team", category: "SaaS", supplier: "Notion / Figma", value: 150.00, recurrence: "monthly", nextDue: "2026-08-15", status: "active", notes: "Ferramentas de prototipação, design e gestão" }
];

const defaultInvoices = [
    { id: "FAT-1001", customerName: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Desenvolvimento E-commerce", value: 7500.00, dueDate: "2026-07-10", status: "paid" },
    { id: "FAT-1002", customerName: "Maria Oliveira", company: "Giga Corp", niche: "E-commerce", productName: "Gestão de Google Ads", value: 1200.00, dueDate: "2026-07-12", status: "paid" },
    { id: "FAT-1003", customerName: "João Silva", company: "Inova Tech", niche: "SaaS / Startup", productName: "Criação de Site Profissional", value: 3500.00, dueDate: "2026-07-14", status: "pending" },
    { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid" },
    { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid" },
    { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-07-20", status: "pending" },
    { id: "FAT-PARANA-4", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, dueDate: "2026-07-31", status: "pending" }
];

const defaultContractsList = [
    { id: "CONTR-1001", contactId: "c2", proposalId: "PROP-mock1", clientName: "Maria Oliveira", company: "Giga Corp", productName: "Desenvolvimento E-commerce", value: 7500.00, recurrence: "single", startDate: "2026-07-09", endDate: "2026-08-09", status: "active" },
    { id: "CONTR-PARANA-1", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-1", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Criação de Site", value: 400.00, recurrence: "single", startDate: "2026-04-13", endDate: "2026-05-13", status: "active" },
    { id: "CONTR-PARANA-2", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-2", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Atualização de Site", value: 500.00, recurrence: "single", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" },
    { id: "CONTR-PARANA-3", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-3", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Manutenção do Site (Anual)", value: 240.00, recurrence: "yearly", startDate: "2026-07-13", endDate: "2027-07-13", status: "active" },
    { id: "CONTR-PARANA-4", contactId: "c_parana_ecoturismo", proposalId: "DIRECT-PARANA-4", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Gestão de Google Ads", value: 400.00, recurrence: "monthly", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" }
];

const defaultEvents = [
    { id: "evt1", title: "Reunião de Escopo - João Silva", contactId: "c1", date: "2026-07-13", time: "14:00", description: "Alinhamento do briefing de criação do site profissional." },
    { id: "evt2", title: "Apresentação da Proposta - Carlos Souza", contactId: "c3", date: "2026-07-15", time: "16:30", description: "Demonstração e negociação de Google Ads." }
];

// Dynamic Proposal Scope Templates
const defaultScopes = {
    p1: [
        "Design de interface personalizado no Figma focado em experiência do usuário",
        "Desenvolvimento responsivo completo (compatível com smartphones, tablets e desktop)",
        "Otimização extrema de carregamento e velocidade (Core Web Vitals)",
        "Implementação de tags de rastreamento (Google Analytics, Meta Pixel)",
        "Configurações iniciais de SEO técnico on-page",
        "Prazo de entrega estimado: 15 dias úteis"
    ],
    p2: [
        "Plataforma e-commerce completa com painel administrativo intuitivo",
        "Integração com gateways de pagamento credenciados (Cartão, PIX, Boleto)",
        "Configuração de frete automático (Correios e transportadoras com cotação online)",
        "Catálogo inteligente com cadastro ilimitado de produtos e controle de estoque",
        "Layout exclusivo responsivo focado em taxas de conversão de checkout",
        "Certificado de segurança SSL integrado"
    ],
    p3: [
        "Planejamento estratégico de tráfego pago focado em captação de leads qualificados",
        "Estudo aprofundado de público-alvo e pesquisa de palavras-chave no Google",
        "Criação e testes de anúncios patrocinados (criativos, textos persuasivos)",
        "Otimização diária de lances, orçamentos e índice de qualidade dos anúncios",
        "Instalação e configuração de tags de conversão do Google Ads",
        "Relatório mensal detalhado de performance com métricas chave (CPL, ROI)"
    ],
    p4: [
        "Auditoria técnica completa do site/landing page atual da empresa",
        "Otimização de arquivos e código-fonte (HTML, CSS e JS minimizados)",
        "Compressão inteligente de imagens sem perda de qualidade visual",
        "Configuração de cache avançado de servidor e CDN global (Cloudflare)",
        "Correções de estrutura SEO (hierarquia de títulos, tags alt, robots, sitemaps)",
        "Relatório comparativo de velocidade (Antes vs Depois) via PageSpeed Insights"
    ],
    p5: [
        "Backup semanal completo do site e banco de dados em nuvem segura",
        "Atualizações recorrentes de plugins, temas e núcleo da plataforma WordPress",
        "Monitoramento de estabilidade e uptime 24/7 (garantia de site no ar)",
        "Suporte técnico prioritário de até 5 horas mensais para alterações de conteúdo",
        "Correções rápida de bugs e problemas de layout pós-atualizações",
        "Canal exclusivo de atendimento via WhatsApp comercial"
    ]
};

function getScopeList(productId) {
    if (defaultScopes[productId]) {
        return defaultScopes[productId];
    }
    return [
        "Prestação de serviço especializado conforme especificações do cliente",
        "Cronograma de execução estruturado em fases alinhadas",
        "Garantia de suporte técnico para ajustes finos e revisões",
        "Entregáveis detalhados e homologação de escopo conjunta"
    ];
}

const defaultMarketingAssets = [
    { id: "ma1", title: "Site Principal - Web Co. Labs", category: "sites", status: "active", url: "https://webcolabs.com.br", metrics: "2.4k visitas/mês", cost: "R$ 45,00/mês", notes: "Site institucional oficial." },
    { id: "ma2", title: "Campanha Google Ads - Criação de Sites", category: "ads", status: "active", url: "https://ads.google.com", metrics: "120 leads/mês | CTR 4.8%", cost: "R$ 1.500,00/mês", notes: "Focado em pequenas empresas locais." },
    { id: "ma3", title: "Instagram Oficial @webcolabs", category: "social", status: "active", url: "https://instagram.com/webcolabs", metrics: "3.2k seguidores | 5.2% engajamento", cost: "R$ 0,00", notes: "Postagens semanais de portfólio." },
    { id: "ma4", title: "SEO Orgânico - Blog de Tecnologia", category: "organic", status: "active", url: "https://webcolabs.com.br/blog", metrics: "850 acessos orgânicos/mês", cost: "R$ 300,00/mês", notes: "Artigos otimizados para busca local." }
];



function applyDashboardCustomization() {
    let settings = {
        showKpis: true,
        showFinancialChart: true,
        showFunnelChart: true,
        showRecentLeads: true,
        showUrgentTasks: true
    };
    
    const saved = localStorage.getItem("nexus_crm_dashboard_widgets");
    if (saved) {
        try {
            settings = { ...settings, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Error parsing dashboard widget settings:", e);
        }
    }
    
    const chkKpis = document.getElementById("chkShowKpiGrid");
    const chkFinancial = document.getElementById("chkShowFinancialChart");
    const chkFunnel = document.getElementById("chkShowFunnelChart");
    const chkRecent = document.getElementById("chkShowRecentLeads");
    const chkUrgent = document.getElementById("chkShowUrgentTasks");
    
    if (chkKpis) chkKpis.checked = settings.showKpis;
    if (chkFinancial) chkFinancial.checked = settings.showFinancialChart;
    if (chkFunnel) chkFunnel.checked = settings.showFunnelChart;
    if (chkRecent) chkRecent.checked = settings.showRecentLeads;
    if (chkUrgent) chkUrgent.checked = settings.showUrgentTasks;
    
    const widgetKpi = document.getElementById("widgetKpiGrid");
    const widgetFinancial = document.getElementById("widgetFinancialChart");
    const widgetFunnel = document.getElementById("widgetFunnelChart");
    const widgetRecent = document.getElementById("widgetRecentLeads");
    const widgetUrgent = document.getElementById("widgetUrgentTasks");
    
    if (widgetKpi) {
        if (settings.showKpis) widgetKpi.style.display = "grid";
        else widgetKpi.style.display = "none";
    }
    
    if (widgetFinancial) {
        if (settings.showFinancialChart) widgetFinancial.style.display = "flex";
        else widgetFinancial.style.display = "none";
    }
    if (widgetFunnel) {
        if (settings.showFunnelChart) widgetFunnel.style.display = "flex";
        else widgetFunnel.style.display = "none";
    }
    
    const chartsGrid = document.querySelector(".charts-grid");
    if (chartsGrid) {
        if (!settings.showFinancialChart && !settings.showFunnelChart) {
            chartsGrid.style.display = "none";
        } else {
            chartsGrid.style.display = "grid";
            if (settings.showFinancialChart && !settings.showFunnelChart) {
                widgetFinancial.style.gridColumn = "span 2";
            } else if (!settings.showFinancialChart && settings.showFunnelChart) {
                widgetFunnel.style.gridColumn = "span 2";
            } else {
                if (widgetFinancial) widgetFinancial.style.gridColumn = "";
                if (widgetFunnel) widgetFunnel.style.gridColumn = "";
            }
        }
    }
    
    if (widgetRecent) {
        if (settings.showRecentLeads) widgetRecent.style.display = "flex";
        else widgetRecent.style.display = "none";
    }
    if (widgetUrgent) {
        if (settings.showUrgentTasks) widgetUrgent.style.display = "flex";
        else widgetUrgent.style.display = "none";
    }
    
    const detailsGrid = document.querySelector(".dashboard-details-grid");
    if (detailsGrid) {
        if (!settings.showRecentLeads && !settings.showUrgentTasks) {
            detailsGrid.style.display = "none";
        } else {
            detailsGrid.style.display = "grid";
            if (settings.showRecentLeads && !settings.showUrgentTasks) {
                widgetRecent.style.gridColumn = "span 2";
            } else if (!settings.showRecentLeads && settings.showUrgentTasks) {
                widgetUrgent.style.gridColumn = "span 2";
            } else {
                if (widgetRecent) widgetRecent.style.gridColumn = "";
                if (widgetUrgent) widgetUrgent.style.gridColumn = "";
            }
        }
    }
}

// Helper to get active environment data
function getEnv() {
    const env = state.environments[state.currentEnv] || state.environments.webco;
    if (env && env.contacts) {
        env.contacts.forEach(c => {
            if (c.value > 1000000 || isNaN(c.value)) {
                c.value = 0;
            }
        });
    }
    return env;
};
function _getEnvOriginal() {
    const env = state.currentEnv || "webco";
    if (!state.environments[env]) {
        state.environments[env] = {
            contacts: [...defaultContacts],
            tasks: [...defaultTasks],
            products: [...defaultProducts],
            customers: [...defaultCustomers],
            proposals: [],
            invoices: [...defaultInvoices],
            expenses: [...defaultExpenses],
            contracts: [...defaultContractsList],
            events: [...defaultEvents],
            marketingAssets: [...defaultMarketingAssets]
        };
    }
    // Dynamic schema checks for users upgrading state
    if (!state.environments[env].proposals) state.environments[env].proposals = [];
    if (!state.environments[env].invoices) state.environments[env].invoices = [...defaultInvoices];
    if (!state.environments[env].expenses) state.environments[env].expenses = [...defaultExpenses];
    if (!state.environments[env].contractedServices || state.environments[env].contractedServices.length === 0) state.environments[env].contractedServices = [...defaultContractedServices];
    if (!state.environments[env].contracts) state.environments[env].contracts = [...defaultContractsList];
    if (!state.environments[env].events) state.environments[env].events = [...defaultEvents];
    if (!state.environments[env].marketingAssets) state.environments[env].marketingAssets = [...defaultMarketingAssets];
    if (!state.environments[env].niches) state.environments[env].niches = ["Negócio Local", "E-commerce", "Infoproduto / Lançamentos", "SaaS / Startup", "Serviços B2B", "Turismo", "Saúde / Estética", "Outro"];
    if (state.environments[env].balanceAdjustment === undefined) state.environments[env].balanceAdjustment = 0;
    // ⚠️ CRITICAL: Always ensure templates and documents arrays exist so they are never lost on schema migration
    if (!state.environments[env].templates) state.environments[env].templates = [];
    if (!state.environments[env].documents) state.environments[env].documents = [...defaultDocuments];
    return state.environments[env];
}

function ensureParanaEcoturismo() {
    const envName = state.currentEnv || "webco";
    if (!state.environments) state.environments = {};
    if (!state.environments[envName]) {
        state.environments[envName] = {
            contacts: [...defaultContacts],
            tasks: [...defaultTasks],
            products: [...defaultProducts],
            customers: [...defaultCustomers],
            proposals: [],
            invoices: [...defaultInvoices],
            expenses: [...defaultExpenses],
            contracts: [...defaultContractsList],
            events: [...defaultEvents],
            marketingAssets: [...defaultMarketingAssets]
        };
    }
    const env = state.environments[envName];
    if (!env.contacts) env.contacts = [...defaultContacts];
    if (!env.customers) env.customers = [...defaultCustomers];
    if (!env.invoices) env.invoices = [...defaultInvoices];
    if (!env.contracts) env.contracts = [...defaultContractsList];
    if (!env.fiscalNotes) env.fiscalNotes = [];
    if (!env.importHistory) env.importHistory = [];

    const exists = env.customers.some(c => c.company === "Paraná Ecoturismo");
    if (!exists) {
        const contactId = "c_parana_ecoturismo";
        
        // Add Contact
        const newContact = {
            id: contactId,
            name: "Marcio",
            company: "Paraná Ecoturismo",
            email: "marcio@paranaecoturismo.com.br",
            phone: "41 96252186",
            value: 1540.00,
            status: "won",
            niche: "Turismo",
            notes: "Localizado em Morretes. Representante: Marcio",
            createdAt: "2026-04-13T12:00:00.000Z",
            timeline: [
                { id: "act_parana_1", type: "note", description: "Cadastrado no sistema. Ramo: Turismo. Representante: Marcio.", timestamp: "2026-04-13T12:00:00.000Z" },
                { id: "act_parana_2", type: "note", description: "Compra fechada de Criação de Site por R$ 400.", timestamp: "2026-04-13T12:30:00.000Z" },
                { id: "act_parana_3", type: "note", description: "Pagamento efetuado: R$ 500 por atualização do site após 3 meses.", timestamp: "2026-07-13T10:00:00.000Z" }
            ]
        };
        env.contacts.push(newContact);

        // Add Customers
        env.customers.push(
            { id: "cust_parana_site", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, type: "single", status: "active", createdAt: "2026-04-13T12:00:00.000Z" },
            { id: "cust_parana_update", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, type: "single", status: "active", createdAt: "2026-07-13T10:00:00.000Z" },
            { id: "cust_parana_maint", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, type: "yearly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" },
            { id: "cust_parana_ads", contactId: contactId, name: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, type: "monthly", status: "active", createdAt: "2026-07-13T12:00:00.000Z" }
        );

        // Add Invoices
        env.invoices.push(
            { id: "FAT-PARANA-1", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Criação de Site", value: 400.00, dueDate: "2026-04-15", status: "paid" },
            { id: "FAT-PARANA-2", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Atualização de Site", value: 500.00, dueDate: "2026-07-13", status: "paid" },
            { id: "FAT-PARANA-3", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Manutenção do Site (Anual)", value: 240.00, dueDate: "2026-07-20", status: "pending" },
            { id: "FAT-PARANA-4", customerName: "Marcio", company: "Paraná Ecoturismo", niche: "Turismo", productName: "Gestão de Google Ads", value: 400.00, dueDate: "2026-07-31", status: "pending" }
        );

        // Add Contracts
        env.contracts.push(
            { id: "CONTR-PARANA-1", contactId: contactId, proposalId: "DIRECT-PARANA-1", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Criação de Site", value: 400.00, recurrence: "single", startDate: "2026-04-13", endDate: "2026-05-13", status: "active" },
            { id: "CONTR-PARANA-2", contactId: contactId, proposalId: "DIRECT-PARANA-2", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Atualização de Site", value: 500.00, recurrence: "single", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" },
            { id: "CONTR-PARANA-3", contactId: contactId, proposalId: "DIRECT-PARANA-3", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Manutenção do Site (Anual)", value: 240.00, recurrence: "yearly", startDate: "2026-07-13", endDate: "2027-07-13", status: "active" },
            { id: "CONTR-PARANA-4", contactId: contactId, proposalId: "DIRECT-PARANA-4", clientName: "Marcio", company: "Paraná Ecoturismo", productName: "Gestão de Google Ads", value: 400.00, recurrence: "monthly", startDate: "2026-07-13", endDate: "2026-08-13", status: "active" }
        );

        saveState();
    }
}

function updateSyncIndicator(isSync) {
    const dot = document.getElementById("syncDot");
    const text = document.getElementById("syncText");
    if (dot && text) {
        if (isSync) {
            dot.style.background = "#10b981"; // Emerald green
            text.innerText = "Nuvem Sincronizada";
        } else {
            dot.style.background = "#f59e0b"; // Amber orange
            text.innerText = "Armazenamento Local";
        }
    }
}

function safeCreateIcons() {
    try {
        if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.error("Error creating Lucide icons:", e);
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconName = "check-circle";
    if (type === "warning") iconName = "alert-triangle";
    if (type === "error") iconName = "alert-circle";
    if (type === "info") iconName = "info";

    toast.innerHTML = `
        <i data-lucide="${iconName}" class="toast-icon"></i>
        <div class="toast-message" style="line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);
    
    try {
        if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.error("Lucide icons error in toast:", e);
    }

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
        toast.addEventListener("transitionend", () => {
            toast.remove();
        });
    }, 3500);
}

function formatDateBr(dateStr) {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function getCategoryBadgeHtml(category) {
    const cat = category || 'Outros';
    let catClass = 'outros';
    if (cat.includes('Infra')) catClass = 'infra';
    else if (cat.includes('Market') || cat.includes('Ads') || cat.includes('Tráfego')) catClass = 'marketing';
    else if (cat.includes('Ferrament') || cat.includes('SaaS') || cat.includes('Software')) catClass = 'saas';
    else if (cat.includes('Pesso') || cat.includes('Free')) catClass = 'pessoal';
    else if (cat.includes('Operac') || cat.includes('Escritó')) catClass = 'operacional';
    else if (cat.includes('Impost') || cat.includes('Taxa')) catClass = 'impostos';
    else if (cat.includes('Comis')) catClass = 'comissoes';

    return `<span class="category-badge ${catClass}">${cat}</span>`;
}

function getRecurrenceBadgeHtml(recurrence) {
    const rec = recurrence || 'single';
    const labels = { single: 'Pontual', monthly: 'Mensal', quarterly: 'Trimestral', annual: 'Anual' };
    const label = labels[rec] || rec;
    return `<span class="recurrence-badge ${rec}">${label}</span>`;
}

const getApiUrl = (path) => {
    const basePath = window.location.pathname.startsWith('/crm') ? '/crm' : '';
    return `${basePath}${path}`;
};

async function saveStateToServer() {
    try {
        const response = await fetch(getApiUrl('/api/state'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        });
        if (response.ok) {
            updateSyncIndicator(true);
        } else {
            updateSyncIndicator(false);
        }
    } catch (e) {
        console.warn("Offline: Salvo apenas localmente.", e);
        updateSyncIndicator(false);
    }
}

// Initialize & Load
async function init() {
    let loadedFromServer = false;
    let serverOnline = false;

    // Load localStorage first as a base — we'll merge on top if server responds
    let localState = null;
    const savedState = localStorage.getItem("nexus_crm_multitenant_state");
    if (savedState) {
        try { localState = JSON.parse(savedState); } catch (err) { console.error("Error parsing localStorage state:", err); }
    }

    try {
        const response = await fetch(getApiUrl('/api/state'));
        if (response.ok) {
            serverOnline = true;
            const data = await response.json();
            if (data) {
                state = data;
                loadedFromServer = true;

                // ⚠️ CRITICAL: Merge templates from localStorage into server state
                // to prevent data loss when server state is behind localStorage.
                if (localState && localState.environments) {
                    Object.keys(localState.environments).forEach(envKey => {
                        const localEnv = localState.environments[envKey];
                        if (localEnv && Array.isArray(localEnv.templates) && localEnv.templates.length > 0) {
                            if (!state.environments) state.environments = {};
                            if (!state.environments[envKey]) state.environments[envKey] = {};
                            const serverEnv = state.environments[envKey];
                            if (!serverEnv.templates || serverEnv.templates.length === 0) {
                                // Server has no templates for this env — restore from local
                                serverEnv.templates = localEnv.templates;
                                console.info(`[init] Restored ${localEnv.templates.length} template(s) from localStorage for env "${envKey}".`);
                            } else {
                                // Merge: add any locally-existing templates that are missing from server
                                localEnv.templates.forEach(localTmpl => {
                                    const alreadyExists = serverEnv.templates.some(t => t.id === localTmpl.id);
                                    if (!alreadyExists) {
                                        serverEnv.templates.push(localTmpl);
                                        console.info(`[init] Merged missing template "${localTmpl.name}" from localStorage.`);
                                    }
                                });
                            }
                        }
                    });
                    // After merge, persist the merged state back to server
                    saveStateToServer();
                }
            }
        }
    } catch (e) {
        console.warn("Servidor offline ao iniciar. Usando dados locais.", e);
    }

    if (!loadedFromServer) {
        if (localState) {
            state = localState;
        }
    }
    
    updateSyncIndicator(serverOnline);
    
    // Privacy Mode setup
    if (state.privacyMode === undefined) {
        state.privacyMode = false;
    }
    if (!state.calendarDate) {
        state.calendarDate = new Date("2026-07-12");
    } else {
        state.calendarDate = new Date(state.calendarDate);
    }
    updatePrivacyIcon();
    
    // Check session login
    const loggedIn = sessionStorage.getItem("nexus_crm_logged_in");
    const loggedEnv = sessionStorage.getItem("nexus_crm_env");
    const loggedUser = sessionStorage.getItem("nexus_crm_username") || "Admin";
    
    if (loggedIn === "true" && loggedEnv) {
        state.currentEnv = loggedEnv;
        ensureParanaEcoturismo();
        // ⚠️ CRITICAL: Purge any legacy dummy 'Lead Agente' entries from browser cache
        const currentData = getEnv();
        if (currentData && currentData.contacts) {
            currentData.contacts = currentData.contacts.filter(c => c.name !== 'Lead Agente' && c.company !== 'Lead Agente');
        }
        document.getElementById("loginOverlay").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("logged-in");
        
        const env = getEnv();
        if (!env.users) {
            env.users = [{ username: "Admin", password: "080125", name: "Admin", role: "Administrador" }];
            saveState();
        }
        const matched = env.users.find(u => u.username.toLowerCase() === loggedUser.toLowerCase());
        document.getElementById("sidebarUsername").innerText = matched ? (matched.name || matched.username) : loggedUser;
        
        // Setup initial view
        renderAll();
        const savedView = localStorage.getItem("nexus_crm_active_view") || "dashboard";
        switchView(savedView);
    } else {
        document.getElementById("loginOverlay").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("logged-in");
    }
}

function saveState() {
    localStorage.setItem("nexus_crm_multitenant_state", JSON.stringify(state));
    saveStateToServer();
}

// Chart Instances
let salesChart = null;
let pipelineChart = null;
let cashFlowChart = null;
let revenueByNicheChart = null;

// Helpers & Formatting

// Lead Value Sanitizer (Prevents absurd numbers > R$ 1M or phone numbers in value field)
const sanitizeLeadValue = (val) => {
    let num = Number(val);
    if (isNaN(num) || !isFinite(num) || num > 1000000 || num < 0) {
        return 0;
    }
    return num;
};
const formatCurrency = (value) => {
    if (state.privacyMode) return "R$ ••••••";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateStr) => {
    if (!dateStr) return "Nenhum";
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "?";
    return name.trim().split(/\s+/).filter(n => n).map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const getDaysSince = (dateStr) => {
    const start = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? "Hoje/Ontem" : `Há ${diffDays} dias`;
};

// UI Rendering Functions
function renderAll() {
    if (!state.currentEnv) return;
    
    const safeRun = (name, fn) => {
        try {
            fn();
        } catch (err) {
            console.error(`Error rendering ${name}:`, err);
        }
    };

    safeRun("ensureParanaEcoturismo", ensureParanaEcoturismo);
    safeRun("renderDashboard", renderDashboard);
    safeRun("renderContacts", renderContacts);
    safeRun("renderKanban", renderKanban);
    safeRun("renderCustomers", renderCustomers);
    safeRun("renderProducts", renderProducts);
    safeRun("renderTasks", renderTasks);
    safeRun("renderProposals", renderProposals);
    safeRun("renderContracts", renderContracts);
    safeRun("renderCalendar", renderCalendar);
    safeRun("renderFinance", renderFinance);
    safeRun("renderMarketingAssets", renderMarketingAssets);
    safeRun("populateContactDropdowns", populateContactDropdowns);
    safeRun("populateConversionProductsDropdown", populateConversionProductsDropdown);
    safeRun("populateEventContactsDropdown", populateEventContactsDropdown);
    safeRun("populateCustomerProductsDropdown", populateCustomerProductsDropdown);
    safeRun("populateUserDropdowns", populateUserDropdowns);
    safeRun("renderUsers", renderUsers);
    safeRun("renderTemplates", renderTemplates);
    safeRun("renderDocuments", renderDocuments);
    safeRun("renderAffiliates", renderAffiliates);
    safeRun("populateAffiliateDropdowns", populateAffiliateDropdowns);
    safeRun("updateCalendarNotifications", updateCalendarNotifications);
    
    safeCreateIcons();
}

// 1. Dashboard Render
// State for dashboard period filter
let dashPeriod = 'month';
let finPeriod = 'month';
let finInvoiceStatus = 'all';
let finInvoiceSearch = '';
let showFinCharts = true;

window.switchView = function(viewId) {
    const targetItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    if (targetItem) targetItem.click();
};

window.editInvoiceById = function(id) {
    const env = getEnv();
    const inv = env.invoices.find(i => i.id === id);
    if (!inv) return;
    
    switchView('finance');
    
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = inv.status === 'overdue' || (inv.status === 'pending' && inv.dueDate && inv.dueDate < today);
    
    if (isOverdue) {
        const tabOverdue = document.getElementById('tabOverdue');
        if (tabOverdue) tabOverdue.click();
    } else {
        const tabInvoices = document.getElementById('tabInvoices');
        if (tabInvoices) tabInvoices.click();
    }

    setTimeout(() => {
        const newVal = prompt('Editar valor da fatura (R$):', inv.value);
        if (newVal === null) return;
        const newDate = prompt('Editar data de vencimento (AAAA-MM-DD):', inv.dueDate || '');
        if (newDate === null) return;
        inv.value = parseFloat(newVal) || inv.value;
        inv.dueDate = newDate || inv.dueDate;
        saveState();
        renderFinance();
        renderDashboard();
        showToast('Fatura atualizada!', 'success');
    }, 150);
};

function getFinPeriodRange() {
    const now = new Date();
    if (finPeriod === 'all') return { start: '2000-01-01', end: '2099-12-31' };
    if (finPeriod === 'year') {
        return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
    }
    if (finPeriod === 'quarter') {
        const q = Math.floor(now.getMonth() / 3);
        const qStart = new Date(now.getFullYear(), q * 3, 1).toISOString().split('T')[0];
        const qEnd = new Date(now.getFullYear(), q * 3 + 3, 0).toISOString().split('T')[0];
        return { start: qStart, end: qEnd };
    }
    // month (default)
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { start: monthStart, end: monthEnd };
}

function getDashPeriodRange() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (dashPeriod === 'all') return { start: '2000-01-01', end: '2099-12-31' };
    if (dashPeriod === 'year') {
        return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
    }
    if (dashPeriod === 'quarter') {
        const q = Math.floor(now.getMonth() / 3);
        const qStart = new Date(now.getFullYear(), q * 3, 1).toISOString().split('T')[0];
        const qEnd = new Date(now.getFullYear(), q * 3 + 3, 0).toISOString().split('T')[0];
        return { start: qStart, end: qEnd };
    }
    // month (default)
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { start: monthStart, end: monthEnd };
}

function renderDashboard() {
    applyDashboardCustomization();
    const env = getEnv();
    const range = getDashPeriodRange();
    const today = new Date().toISOString().split('T')[0];

    // Setup period filter buttons
    const filterGroup = document.getElementById('dashPeriodFilterGroup');
    if (filterGroup) {
        filterGroup.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === dashPeriod);
            btn.onclick = () => { dashPeriod = btn.dataset.period; renderDashboard(); };
        });
    }

    // Filter customers & invoices by selected period
    const filteredCustomers = (dashPeriod === 'all')
        ? env.customers
        : env.customers.filter(c => {
            const d = (c.createdAt || '2000-01-01').split('T')[0];
            return d >= range.start && d <= range.end;
        });

    const filteredInvoices = (dashPeriod === 'all')
        ? env.invoices
        : env.invoices.filter(inv => {
            const d = inv.dueDate || '';
            return d >= range.start && d <= range.end;
        });

    // === KPIs (dados reais) ===
    // Receita do período: soma de faturas pagas no período
    const periodRevenue = filteredInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.value || 0), 0);

    const activePipelineValue = env.contacts
        .filter(c => ['contacted', 'proposal', 'negotiating'].includes(c.status))
        .reduce((sum, c) => sum + (c.value || 0), 0);

    const totalDeals = env.contacts.length;
    const wonDeals = env.contacts.filter(c => c.status === 'won').length;
    const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;
    const pendingTasksCount = env.tasks.filter(t => !t.completed).length;

    document.getElementById("kpiTotalSales").innerText = formatCurrency(periodRevenue);
    document.getElementById("kpiActivePipeline").innerText = formatCurrency(activePipelineValue);
    document.getElementById("kpiConversionRate").innerText = `${conversionRate}%`;
    document.getElementById("kpiPendingTasks").innerText = pendingTasksCount;

    const conversionBadge = document.getElementById("kpiConversionBadge");
    conversionBadge.innerText = conversionRate >= 25 ? "Alta Conversão" : "Trabalhar Leads";
    conversionBadge.className = conversionRate >= 25 ? "kpi-badge positive" : "kpi-badge warning";

    const taskBadge = document.getElementById("kpiTaskStatusBadge");
    taskBadge.innerText = pendingTasksCount === 0 ? "Tudo em dia" : `${pendingTasksCount} pendentes`;
    taskBadge.className = pendingTasksCount === 0 ? "kpi-badge positive" : "kpi-badge warning";

    // === Saldo Total (todas as receitas recebidas - despesas + ajuste) ===
    const totalRevenue = env.invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.value || 0), 0);
    const totalExpenses = (env.expenses || []).reduce((sum, e) => sum + (e.value || 0), 0);
    const balance = totalRevenue - totalExpenses + (env.balanceAdjustment || 0);

    const balanceEl = document.getElementById('dashBalanceValue');
    if (balanceEl) {
        balanceEl.innerText = formatCurrency(balance);
        balanceEl.style.color = balance < 0 ? '#f87171' : '#ffffff';
    }
    const balanceSubEl = document.getElementById('dashBalanceSub');
    if (balanceSubEl) {
        const adj = env.balanceAdjustment || 0;
        balanceSubEl.innerText = `Recebido ${formatCurrency(totalRevenue)} − Despesas ${formatCurrency(totalExpenses)}${adj !== 0 ? ` + Ajuste ${formatCurrency(adj)}` : ''}`;
    }

    // === Top Produtos (do período selecionado, ou tudo se vazio) ===
    const invSource = filteredInvoices.length > 0 ? filteredInvoices : env.invoices;
    const productRevMap = {};
    invSource.forEach(inv => {
        const key = inv.productName || 'Outros';
        productRevMap[key] = (productRevMap[key] || 0) + (inv.value || 0);
    });
    const topProducts = Object.entries(productRevMap)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxVal = topProducts.length > 0 ? topProducts[0][1] : 1;
    const topListEl = document.getElementById('dashTopProductsList');
    if (topListEl) {
        topListEl.innerHTML = topProducts.length === 0
            ? `<div style="color:var(--text-muted);font-size:12px;padding:10px 0;">Nenhum produto registrado ainda.</div>`
            : topProducts.map(([name, val], i) => `
                <div class="top-product-item">
                    <div class="top-product-rank">${i + 1}</div>
                    <div class="top-product-info">
                        <div class="top-product-name" title="${name}">${name}</div>
                        <div class="top-product-bar-row">
                            <div class="top-product-bar"><div class="top-product-bar-fill" style="width:${Math.round((val/maxVal)*100)}%"></div></div>
                            <span class="top-product-value">${formatCurrency(val)}</span>
                        </div>
                    </div>
                </div>`).join('');
    }

    // === Leads Recentes ===
    const recentLeads = [...env.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const tbody = document.getElementById("recentLeadsTableBody");
    tbody.innerHTML = "";
    recentLeads.forEach(lead => {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => openContactDetails(lead.id));
        tr.innerHTML = `
            <td><div class="col-contact-info"><div class="contact-avatar">${getInitials(lead.name)}</div><span>${lead.name}</span></div></td>
            <td>${lead.company || "-"}</td>
            <td><strong>${formatCurrency(lead.value)}</strong></td>
            <td><span class="status-badge ${lead.status}">${translateStatus(lead.status)}</span></td>`;
        tbody.appendChild(tr);
    });

    // === Tarefas Urgentes ===
    const urgentTasks = env.tasks.filter(t => !t.completed)
        .sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]))
        .slice(0, 4);
    const urgentTasksContainer = document.getElementById("urgentTasksList");
    urgentTasksContainer.innerHTML = "";
    if (urgentTasks.length === 0) {
        urgentTasksContainer.innerHTML = `<div class="table-empty-state"><p>Nenhuma tarefa pendente!</p></div>`;
    } else {
        urgentTasks.forEach(task => {
            const contactName = task.contactId ? (env.contacts.find(c => c.id === task.contactId)?.name || "") : "";
            const div = document.createElement("div");
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-toggle-btn" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-checkbox"></div>
                </label>
                <div class="task-content">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        ${contactName ? `<span>👤 ${contactName}</span>` : ""}
                        <span>📅 ${formatDate(task.dueDate)}</span>
                        <span class="task-priority-badge ${task.priority}">${task.priority}</span>
                    </div>
                </div>`;
            div.querySelector("input").addEventListener("change", (e) => toggleTaskComplete(task.id, e.target.checked));
            urgentTasksContainer.appendChild(div);
        });
    }

    renderForecast(env);
    renderCharts();
}

// === FORECAST / PREVISÃO ===
function renderForecast(env) {
    if (!env) env = getEnv();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const in30 = new Date(today); in30.setDate(today.getDate() + 30);
    const in30Str = in30.toISOString().split('T')[0];

    // MRR real: clientes mensais ativos
    const mrr = env.customers
        .filter(c => c.status === 'active' && c.type === 'monthly')
        .reduce((sum, c) => sum + (c.value || 0), 0);

    // Faturas pendentes nos próximos 30 dias
    const pendingNext30 = env.invoices
        .filter(inv => ['pending', 'pending_delivery'].includes(inv.status) && inv.dueDate >= todayStr && inv.dueDate <= in30Str)
        .reduce((sum, inv) => sum + (inv.value || 0), 0);

    const next30Total = mrr + pendingNext30;
    const quarter = mrr * 3;

    const activeClients = [...new Set(
        env.customers.filter(c => c.status === 'active').map(c => c.company || c.name)
    )].length;

    const churnRisk = env.customers
        .filter(c => c.status === 'active' && c.endDate && c.endDate >= todayStr && c.endDate <= in30Str).length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    set('forecastMRR', formatCurrency(mrr));
    set('forecastNext30', formatCurrency(next30Total));
    set('forecastQuarter', formatCurrency(quarter));
    set('forecastActiveClients', activeClients);
    set('forecastChurnRisk', churnRisk > 0 ? `⚠ ${churnRisk} contrato(s) vencendo em 30 dias` : 'Sem risco de churn próximo');

    // Tabela de pagamentos previstos
    const tbody = document.getElementById('forecastPaymentsBody');
    if (!tbody) return;

    const upcoming = env.invoices
        .filter(inv => ['pending', 'pending_delivery', 'overdue'].includes(inv.status) && inv.dueDate)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 10);

    if (upcoming.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:16px;">Sem pagamentos previstos. Adicione clientes com data de vencimento.</td></tr>`;
        return;
    }

    tbody.innerHTML = upcoming.map(inv => {
        const isOverdue = inv.dueDate < todayStr;
        const statusHtml = isOverdue
            ? `<span class="badge-overdue">Vencida</span>`
            : inv.status === 'pending_delivery'
            ? `<span class="badge-status pending_delivery">Na Entrega</span>`
            : `<span style="background:var(--color-warning-bg);color:var(--color-warning);padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">Pendente</span>`;
        return `<tr onclick="editInvoiceById('${inv.id}')" style="cursor:pointer;" title="Clique para gerenciar este lançamento" class="clickable-row-hover">
            <td><strong>${inv.customerName || inv.company || '-'}</strong></td>
            <td style="font-size:12px;color:var(--text-secondary);">${inv.productName || '-'}</td>
            <td style="color:${isOverdue ? 'var(--color-danger)' : 'inherit'};font-weight:${isOverdue ? '600' : '400'};">${formatDate(inv.dueDate)}</td>
            <td><strong>${formatCurrency(inv.value)}</strong></td>
            <td>${statusHtml}</td>
        </tr>`;
    }).join('');
}

// Toggle segunda data ao selecionar condição 50%
function togglePartialDates(val) {
    const row = document.getElementById('partialSecondDateRow');
    if (row) row.style.display = val === 'partial' ? 'grid' : 'none';
    const label1 = document.querySelector('label[for="customerPaymentDueDate"]');
    if (label1) label1.textContent = val === 'partial' ? 'Data do 1º Pagamento (Entrada)' : 'Data do 1º Pagamento';
}

function translateStatus(status) {
    const trans = {
        lead: "Novo Lead",
        contacted: "Contatado",
        proposal: "Proposta Enviada",
        negotiating: "Em Negociação",
        won: "Ganho",
        lost: "Perdido"
    };
    return trans[status] || status;
}

// Charts rendering
function renderCharts() {
    const env = getEnv();
    if (salesChart) salesChart.destroy();
    if (pipelineChart) pipelineChart.destroy();

    const wonTotal = env.contacts.filter(c => c.status === 'won').reduce((sum, c) => sum + c.value, 0);
    const negTotal = env.contacts.filter(c => c.status === 'negotiating').reduce((sum, c) => sum + c.value, 0);
    const propTotal = env.contacts.filter(c => c.status === 'proposal').reduce((sum, c) => sum + c.value, 0);
    const contTotal = env.contacts.filter(c => c.status === 'contacted').reduce((sum, c) => sum + c.value, 0);

    const ctxSales = document.getElementById('salesTrendChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    const chartLabelColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2a2a40' : '#e5e7eb';

    salesChart = new Chart(ctxSales, {
        type: 'bar',
        data: {
            labels: ['Contatado', 'Proposta', 'Em Negociação', 'Ganho (Won)'],
            datasets: [{
                label: 'Receita (R$)',
                data: [contTotal, propTotal, negTotal, wonTotal],
                backgroundColor: [
                    'rgba(0, 140, 255, 0.75)',
                    'rgba(13, 148, 136, 0.75)',
                    'rgba(154, 52, 18, 0.75)',
                    'rgba(22, 101, 52, 0.75)'
                ],
                borderColor: [
                    '#008cff',
                    '#0d9488',
                    '#9a3412',
                    '#166534'
                ],
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: chartLabelColor } },
                y: { grid: { color: gridColor }, ticks: { color: chartLabelColor, callback: (v) => formatCurrency(v) } }
            }
        }
    });
}

let contactsTableState = {
    currentPage: 1,
    itemsPerPage: 50,
    sortColumn: 'createdAt',
    sortOrder: 'desc'
};

function sortContactsTable(col) {
    if (contactsTableState.sortColumn === col) {
        contactsTableState.sortOrder = contactsTableState.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        contactsTableState.sortColumn = col;
        contactsTableState.sortOrder = 'asc';
    }
    renderContacts();
}
window.sortContactsTable = sortContactsTable;

function renderContacts() {
    const env = getEnv();
    const filterStatus = document.getElementById("filterStatus") ? document.getElementById("filterStatus").value : "all";
    const filterNiche = document.getElementById("contactsNicheFilter") ? document.getElementById("contactsNicheFilter").value : "all";
    
    const searchValGlobal = document.getElementById("globalSearch") ? document.getElementById("globalSearch").value.toLowerCase().trim() : "";
    const searchValLocal = document.getElementById("contactsSearchInput") ? document.getElementById("contactsSearchInput").value.toLowerCase().trim() : "";
    const searchVal = searchValLocal || searchValGlobal;

    const perPageVal = document.getElementById("contactsPerPageSelect") ? document.getElementById("contactsPerPageSelect").value : "50";
    contactsTableState.itemsPerPage = perPageVal === "all" ? 999999 : (parseInt(perPageVal, 10) || 50);

    let allContacts = [...env.contacts];

    // Update KPI Metric Ribbon
    const totalCount = allContacts.length;
    const graficaCount = allContacts.filter(c => (c.niche && c.niche.toLowerCase().includes('graf')) || (c.company && c.company.toLowerCase().includes('graf'))).length;
    const agentCount = allContacts.filter(c => c.source === 'Agente Comercial' || (c.id && c.id.includes('agente'))).length;
    const pipelineValue = allContacts.reduce((acc, c) => acc + (Number(c.value) || 0), 0);

    const elTotal = document.getElementById("kpiTotalContactsCount");
    const elGrafica = document.getElementById("kpiGraficaContactsCount");
    const elAgent = document.getElementById("kpiAgentContactsCount");
    const elPipe = document.getElementById("kpiTotalPipelineValue");

    if (elTotal) elTotal.innerText = totalCount;
    if (elGrafica) elGrafica.innerText = graficaCount;
    if (elAgent) elAgent.innerText = agentCount;
    if (elPipe) elPipe.innerText = formatCurrency(pipelineValue);

    // Apply Status Filter
    let filtered = allContacts;
    if (filterStatus === "agente") {
        filtered = filtered.filter(c => c.source === 'Agente Comercial' || (c.id && c.id.includes('agente')) || (c.notes && c.notes.toLowerCase().includes('agente')));
    } else if (filterStatus !== "all") {
        filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Apply Nicho Filter
    if (filterNiche !== "all") {
        filtered = filtered.filter(c => c.niche === filterNiche);
    }

    // Apply Search Input (Normalized accent-insensitive)
    if (searchVal) {
        const norm = (s) => (s || '').toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const query = norm(searchVal);

        filtered = filtered.filter(c => 
            norm(c.name).includes(query) ||
            norm(c.company).includes(query) ||
            norm(c.niche).includes(query) ||
            norm(c.email).includes(query) ||
            norm(c.phone).includes(query) ||
            norm(c.notes).includes(query)
        );
    }

    // Sorting
    const sortCol = contactsTableState.sortColumn;
    const sortAsc = contactsTableState.sortOrder === 'asc';
    filtered.sort((a, b) => {
        let valA = a[sortCol] || '';
        let valB = b[sortCol] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    const tbody = document.getElementById("contactsTableBody");
    const cardsGrid = document.getElementById("contactsCardsGrid");
    const tableCard = document.getElementById("contactsTableCard");
    const emptyState = document.getElementById("contactsEmptyState");
    const paginationContainer = document.getElementById("contactsPaginationContainer");

    if (tbody) tbody.innerHTML = "";
    if (cardsGrid) cardsGrid.innerHTML = "";

    if (filtered.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        if (tableCard) tableCard.classList.add("hidden");
        if (cardsGrid) cardsGrid.classList.add("hidden");
        if (paginationContainer) paginationContainer.style.display = "none";
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (paginationContainer) paginationContainer.style.display = "flex";

    // Determine layout mode (auto detects screen width <= 768px for cards)
    const isMobileScreen = window.innerWidth <= 768;
    const isCardsView = contactsTableState.viewMode === 'cards' || (contactsTableState.viewMode === 'auto' && isMobileScreen);

    if (isCardsView) {
        if (cardsGrid) cardsGrid.classList.remove("hidden");
        if (tableCard) tableCard.classList.add("hidden");
    } else {
        if (cardsGrid) cardsGrid.classList.add("hidden");
        if (tableCard) tableCard.classList.remove("hidden");
    }

    // Pagination calculations
    const totalItems = filtered.length;
    const itemsPerPage = contactsTableState.itemsPerPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (contactsTableState.currentPage > totalPages) {
        contactsTableState.currentPage = totalPages;
    }
    if (contactsTableState.currentPage < 1) {
        contactsTableState.currentPage = 1;
    }

    const startIndex = (contactsTableState.currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filtered.slice(startIndex, endIndex);

    // Update Pagination Info Bar
    const pagInfo = document.getElementById("contactsPaginationInfo");
    if (pagInfo) {
        pagInfo.innerText = `Exibindo ${totalItems === 0 ? 0 : startIndex + 1} a ${endIndex} de ${totalItems} contatos`;
    }

    // Build Pagination Buttons
    const pagButtons = document.getElementById("contactsPaginationButtons");
    if (pagButtons) {
        pagButtons.innerHTML = "";
        
        // Prev button
        const btnPrev = document.createElement("button");
        btnPrev.className = "btn btn-secondary btn-sm";
        btnPrev.style.cssText = "height: 30px; padding: 0 10px; font-size: 12px;";
        btnPrev.innerHTML = "◀️ Anterior";
        btnPrev.disabled = contactsTableState.currentPage === 1;
        btnPrev.onclick = () => {
            if (contactsTableState.currentPage > 1) {
                contactsTableState.currentPage--;
                renderContacts();
            }
        };
        pagButtons.appendChild(btnPrev);

        // Page Indicator / Page Numbers
        let maxVisiblePages = 5;
        let startPage = Math.max(1, contactsTableState.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let p = startPage; p <= endPage; p++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = p === contactsTableState.currentPage ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm";
            pageBtn.style.cssText = `height: 30px; min-width: 30px; padding: 0 8px; font-size: 12px; ${p === contactsTableState.currentPage ? 'font-weight: 700;' : ''}`;
            pageBtn.innerText = p;
            pageBtn.onclick = () => {
                contactsTableState.currentPage = p;
                renderContacts();
            };
            pagButtons.appendChild(pageBtn);
        }

        // Next button
        const btnNext = document.createElement("button");
        btnNext.className = "btn btn-secondary btn-sm";
        btnNext.style.cssText = "height: 30px; padding: 0 10px; font-size: 12px;";
        btnNext.innerHTML = "Próxima ▶️";
        btnNext.disabled = contactsTableState.currentPage === totalPages;
        btnNext.onclick = () => {
            if (contactsTableState.currentPage < totalPages) {
                contactsTableState.currentPage++;
                renderContacts();
            }
        };
        pagButtons.appendChild(btnNext);
    }

    // Helper event binder for rows and cards
    const bindRowActions = (element, c) => {
        const statusSelect = element.querySelector(".select-inline-status");
        if (statusSelect) {
            statusSelect.onchange = (e) => {
                const newStatus = e.target.value;
                const prevStatus = c.status;
                c.status = newStatus;
                
                if (!c.timeline) c.timeline = [];
                c.timeline.push({
                    id: "act_" + Date.now(),
                    type: "note",
                    description: `Estágio atualizado na listagem para: ${translateStatus(newStatus)}`,
                    timestamp: new Date().toISOString()
                });
                
                if (newStatus === "won" && prevStatus !== "won") {
                    openConversionModal(c.id);
                } else {
                    saveState();
                    renderAll();
                }
            };
        }

        const btnSend = element.querySelector(".btn-send-template");
        if (btnSend) btnSend.addEventListener("click", (e) => { e.stopPropagation(); openSendTemplateModal(null, c.id); });
        
        const btnView = element.querySelector(".btn-view");
        if (btnView) btnView.addEventListener("click", () => openContactDetails(c.id));
        
        const btnEdit = element.querySelector(".btn-edit");
        if (btnEdit) btnEdit.addEventListener("click", () => openEditContact(c.id));
        
        const btnDelete = element.querySelector(".btn-delete");
        if (btnDelete) btnDelete.addEventListener("click", () => deleteContact(c.id));
    };

    // Render Items
    paginatedItems.forEach(c => {
        const isAgente = c.source === 'Agente Comercial' || (c.id && c.id.includes('agente')) || (c.notes && c.notes.toLowerCase().includes('agente'));
        const isAgenteBadge = isAgente ? `<span style="font-size:10px;background:rgba(79,70,229,0.1);color:#4F46E5;border:1px solid rgba(79,70,229,0.3);padding:2px 6px;border-radius:99px;font-weight:600;display:inline-flex;align-items:center;gap:2px;">🤖 AI</span>` : '';
        
        const rawPhoneDigits = (c.phone || '').replace(/\D/g, '');
        const waLink = rawPhoneDigits ? `https://wa.me/55${rawPhoneDigits.length >= 10 && rawPhoneDigits.startsWith('55') ? rawPhoneDigits.substring(2) : rawPhoneDigits}` : null;
        
        const phoneDisplay = c.phone 
            ? `<div style="display:flex; align-items:center; gap:6px;">
                 <span style="font-family:monospace; font-size:12px; font-weight:600; color:var(--text-primary);">${c.phone}</span>
                 ${waLink ? `<a href="${waLink}" target="_blank" title="Abrir conversa no WhatsApp" style="display:inline-flex; align-items:center; gap:3px; font-size:10.5px; font-weight:700; background:#25D366; color:#fff; padding:2px 7px; border-radius:4px; text-decoration:none;">💬 WA</a>` : ''}
               </div>`
            : `<span style="color:var(--text-muted); font-size:11px;">Sem telefone</span>`;

        const lastTimelineItem = c.timeline && c.timeline.length > 0 ? c.timeline[c.timeline.length - 1] : null;
        const lastInteractionText = lastTimelineItem 
            ? `${lastTimelineItem.type === 'call' ? '📞' : lastTimelineItem.type === 'email' ? '✉️' : lastTimelineItem.type === 'meeting' ? '🤝' : '📝'} ${lastTimelineItem.description.substring(0, 24)}...`
            : "Sem interações";

        if (isCardsView) {
            // Render Mobile Card Item
            const card = document.createElement("div");
            card.className = "contact-card-item";
            card.style.cssText = "background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow-sm);";
            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                        <input type="checkbox" class="contact-checkbox" data-id="${c.id}" style="cursor: pointer;">
                        <div class="contact-avatar" style="width: 36px; height: 36px; font-size: 11px; flex-shrink: 0; ${isAgente ? 'background:linear-gradient(135deg,#4F46E5,#06B6D4);color:#fff;font-weight:700;' : ''}">${getInitials(c.name)}</div>
                        <div style="min-width: 0; flex: 1;">
                            <span style="font-weight: 700; font-size: 13px; color: var(--text-primary); display: flex; align-items: center; gap: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name} ${isAgenteBadge}</span>
                            <span style="font-size: 11.5px; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.company || 'Empresa não informada'}</span>
                        </div>
                    </div>
                    <span class="niche-tag" style="font-size: 10.5px; padding: 2px 7px; border-radius: 4px; font-weight: 600; background: rgba(79,70,229,0.08); color: var(--color-primary); flex-shrink: 0;">${c.niche || 'Outro'}</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--bg-app); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        ${waLink ? `<a href="${waLink}" target="_blank" title="Abrir WhatsApp" style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; background: #25D366; color: #fff; padding: 3px 8px; border-radius: 4px; text-decoration: none;">💬 WA</a>` : ''}
                        <span style="font-family: monospace; font-size: 12px; font-weight: 600; color: var(--text-primary);">${c.phone || 'Sem telefone'}</span>
                    </div>
                    <strong style="font-size: 13px; color: #059669;">${formatCurrency(c.value)}</strong>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11.5px;">
                    <select class="select-inline-status status-${c.status}" data-id="${c.id}" style="
                        font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 5px;
                        border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); outline: none; flex: 1;
                    ">
                        <option value="lead" ${c.status === 'lead' ? 'selected' : ''}>Novo Lead</option>
                        <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                        <option value="proposal" ${c.status === 'proposal' ? 'selected' : ''}>Proposta Enviada</option>
                        <option value="negotiating" ${c.status === 'negotiating' ? 'selected' : ''}>Em Negociação</option>
                        <option value="won" ${c.status === 'won' ? 'selected' : ''}>Ganho (Won)</option>
                        <option value="lost" ${c.status === 'lost' ? 'selected' : ''}>Perdido (Lost)</option>
                    </select>

                    <div class="kanban-card-actions" style="display: inline-flex; gap: 3px; flex-shrink: 0;">
                        <button class="btn-icon-only btn-send-template" title="Enviar E-mail" style="color:var(--color-primary); width:28px; height:28px;"><i data-lucide="mail-plus" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-view" title="Ver Detalhes" style="width:28px; height:28px;"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-edit" title="Editar" style="width:28px; height:28px;"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete" title="Excluir" style="width:28px; height:28px;"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </div>
            `;

            bindRowActions(card, c);
            if (cardsGrid) cardsGrid.appendChild(card);
        } else {
            // Render Table Row
            const tr = document.createElement("tr");
            tr.style.cssText = "height: 48px; border-bottom: 1px solid var(--border-color);";
            tr.innerHTML = `
                <td style="text-align:center; width:36px;"><input type="checkbox" class="contact-checkbox" data-id="${c.id}"></td>
                <td>
                    <div class="col-contact-info" style="display:flex; align-items:center; gap:8px;">
                        <div class="contact-avatar" style="width:32px; height:32px; font-size:11px; flex-shrink:0; ${isAgente ? 'background:linear-gradient(135deg,#4F46E5,#06B6D4);color:#fff;font-weight:700;' : ''}">${getInitials(c.name)}</div>
                        <div style="min-width:0; flex:1;">
                            <span style="font-weight:600; font-size:12.5px; color:var(--text-primary); display:inline-flex; align-items:center; gap:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${c.name}">${c.name} ${isAgenteBadge}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span style="font-size:12.5px; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block;" title="${c.company || '-'}">${c.company || "-"}</span>
                </td>
                <td><span class="niche-tag" style="font-size:10.5px; padding:2px 8px; border-radius:4px; font-weight:600; background:rgba(79,70,229,0.08); color:var(--color-primary); white-space:nowrap;">${c.niche || "Outro"}</span></td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:1px;">
                        ${phoneDisplay}
                        ${c.email ? `<span style="font-size:10.5px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;" title="${c.email}">${c.email}</span>` : ''}
                    </div>
                </td>
                <td><strong style="font-size:12.5px; color:#059669; white-space:nowrap;">${formatCurrency(c.value)}</strong></td>
                <td>
                    <select class="select-inline-status status-${c.status}" data-id="${c.id}" style="
                        font-size: 11px;
                        font-weight: 600;
                        padding: 3px 8px;
                        border-radius: 5px;
                        border: 1px solid var(--border-color);
                        background: var(--bg-card);
                        color: var(--text-primary);
                        cursor: pointer;
                        outline: none;
                    ">
                        <option value="lead" ${c.status === 'lead' ? 'selected' : ''}>Novo Lead</option>
                        <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                        <option value="proposal" ${c.status === 'proposal' ? 'selected' : ''}>Proposta Enviada</option>
                        <option value="negotiating" ${c.status === 'negotiating' ? 'selected' : ''}>Em Negociação</option>
                        <option value="won" ${c.status === 'won' ? 'selected' : ''}>Ganho (Won)</option>
                        <option value="lost" ${c.status === 'lost' ? 'selected' : ''}>Perdido (Lost)</option>
                    </select>
                </td>
                <td>
                    <div class="contact-comm-info" style="display:flex; flex-direction:column; max-width:160px;">
                        <span style="font-size:11px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${lastTimelineItem ? lastTimelineItem.description : 'Sem interações'}">${lastInteractionText}</span>
                        <span style="font-size:9.5px; color:var(--text-muted);">${lastTimelineItem ? formatDate(lastTimelineItem.timestamp) : ""}</span>
                    </div>
                </td>
                <td style="text-align:right;">
                    <div class="kanban-card-actions" style="display:inline-flex; gap:2px;">
                        <button class="btn-icon-only btn-send-template" title="Enviar E-mail com Modelo" style="color:var(--color-primary); width:26px; height:26px;"><i data-lucide="mail-plus" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-view" title="Ver Detalhes" style="width:26px; height:26px;"><i data-lucide="eye" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-edit" title="Editar" style="width:26px; height:26px;"><i data-lucide="edit-2" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-delete" title="Excluir" style="width:26px; height:26px;"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>
                    </div>
                </td>
            `;

            bindRowActions(tr, c);
            if (tbody) tbody.appendChild(tr);
        }
    });

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// 3. Kanban Pipeline Render
function renderKanban() {
    const env = getEnv();
    const stages = ['lead', 'contacted', 'proposal', 'negotiating', 'won', 'lost'];
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    // Read pipeline filters
    const filterNiche = document.getElementById("kanbanFilterNiche") ? document.getElementById("kanbanFilterNiche").value : "all";
    const filterPeriod = document.getElementById("kanbanFilterPeriod") ? document.getElementById("kanbanFilterPeriod").value : "all";

    // Helper for period filtering
    const filterByPeriod = (dateStr, periodKey) => {
        if (periodKey === "all") return true;
        const d = new Date(dateStr);
        const now = new Date();
        if (periodKey === "this_month") {
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }
        if (periodKey === "last_30") {
            return (now - d) <= (30 * 24 * 60 * 60 * 1000);
        }
        if (periodKey === "last_90") {
            return (now - d) <= (90 * 24 * 60 * 60 * 1000);
        }
        return true;
    };

    // Filter contacts based on niche, period and search
    let filteredContacts = env.contacts.filter(c => {
        // Search filter
        if (searchVal) {
            const matchSearch = c.name.toLowerCase().includes(searchVal) || 
                               (c.company && c.company.toLowerCase().includes(searchVal)) ||
                               (c.niche && c.niche.toLowerCase().includes(searchVal));
            if (!matchSearch) return false;
        }
        // Niche filter
        if (filterNiche !== "all" && c.niche !== filterNiche) {
            return false;
        }
        // Period filter
        if (!filterByPeriod(c.createdAt || new Date().toISOString(), filterPeriod)) {
            return false;
        }
        return true;
    });

    // Calculate Sales Funnel Metrics
    const topLeads = filteredContacts.filter(c => c.status === 'lead' || c.status === 'contacted');
    const midLeads = filteredContacts.filter(c => c.status === 'proposal' || c.status === 'negotiating');
    const bottomLeads = filteredContacts.filter(c => c.status === 'won');

    const topCount = topLeads.length;
    const topValue = topLeads.reduce((sum, c) => sum + (c.value || 0), 0);

    const midCount = midLeads.length;
    const midValue = midLeads.reduce((sum, c) => sum + (c.value || 0), 0);

    const bottomCount = bottomLeads.length;
    const bottomValue = bottomLeads.reduce((sum, c) => sum + (c.value || 0), 0);

    // Calculate marketing costs (Active Marketing Assets monthly cost + logged marketing expenses in period)
    const activeAssetsCost = env.marketingAssets
        .filter(a => a.status === 'active')
        .reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);

    let periodExpenses = env.expenses.filter(e => e.category === 'marketing');
    periodExpenses = periodExpenses.filter(e => filterByPeriod(e.date, filterPeriod));
    const loggedExpensesCost = periodExpenses.reduce((sum, e) => sum + e.value, 0);

    let totalMarketingCost = loggedExpensesCost;
    if (filterPeriod === "this_month" || filterPeriod === "last_30" || filterPeriod === "all") {
        totalMarketingCost += activeAssetsCost;
    } else if (filterPeriod === "last_90") {
        totalMarketingCost += (activeAssetsCost * 3);
    }

    // Conversion rate
    const totalFunnelCount = topCount + midCount + bottomCount;
    const conversionRate = totalFunnelCount > 0 ? (bottomCount / totalFunnelCount) * 100 : 0;

    // Update Dashboard Metrics UI
    if (document.getElementById("funnelTopCount")) {
        document.getElementById("funnelTopCount").innerText = topCount;
        document.getElementById("funnelTopValue").innerText = `${formatCurrency(topValue)} est.`;
    }
    if (document.getElementById("funnelMidCount")) {
        document.getElementById("funnelMidCount").innerText = midCount;
        document.getElementById("funnelMidValue").innerText = `${formatCurrency(midValue)} est.`;
    }
    if (document.getElementById("funnelBottomCount")) {
        document.getElementById("funnelBottomCount").innerText = bottomCount;
        document.getElementById("funnelBottomValue").innerText = `${formatCurrency(bottomValue)} fat.`;
    }
    if (document.getElementById("funnelCostValue")) {
        document.getElementById("funnelCostValue").innerText = formatCurrency(totalMarketingCost);
    }
    if (document.getElementById("funnelConversionRate")) {
        document.getElementById("funnelConversionRate").innerText = `${conversionRate.toFixed(1)}%`;
    }

    // Toggle containers based on active mode
    const kanbanBoard = document.querySelector(".kanban-board");
    const funnelContainer = document.getElementById("pipelineFunnelViewContainer");
    
    // Toggle active classes on buttons
    const btnKanban = document.getElementById("btnPipelineModeKanban");
    const btnFunnel = document.getElementById("btnPipelineModeFunnel");
    if (btnKanban && btnFunnel) {
        if (state.pipelineViewMode === "funnel") {
            btnKanban.classList.remove("active");
            btnFunnel.classList.add("active");
            if (kanbanBoard) kanbanBoard.classList.add("hidden");
            if (funnelContainer) funnelContainer.classList.remove("hidden");
        } else {
            btnKanban.classList.add("active");
            btnFunnel.classList.remove("active");
            if (kanbanBoard) kanbanBoard.classList.remove("hidden");
            if (funnelContainer) funnelContainer.classList.add("hidden");
        }
    }

    const funnelSelect = document.getElementById("funnelLayersSelect");
    if (funnelSelect) {
        funnelSelect.value = env.funnelLayers || 3;
        funnelSelect.onchange = (e) => {
            env.funnelLayers = parseInt(e.target.value);
            saveState();
            renderAll();
        };
    }

    if (state.pipelineViewMode === "funnel") {
        const funnelConfig = {
            3: [
                { key: "top", name: "1. TOPO (Novos Leads)", stages: ["lead", "contacted"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "mid", name: "2. MEIO (Orçamentos)", stages: ["proposal", "negotiating"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "bottom", name: "3. FUNDO (Fechados)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" }
            ],
            4: [
                { key: "layer1", name: "1. Novos Leads", stages: ["lead"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "layer2", name: "2. Contatados", stages: ["contacted"], color: "var(--color-purple)", bg: "rgba(168, 85, 247, 0.08)", text: "Leads" },
                { key: "layer3", name: "3. Em Negociação", stages: ["proposal", "negotiating"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "layer4", name: "4. Fechados (Won)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" }
            ],
            5: [
                { key: "layer1", name: "1. Novos Leads", stages: ["lead"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "layer2", name: "2. Contatados", stages: ["contacted"], color: "var(--color-purple)", bg: "rgba(168, 85, 247, 0.08)", text: "Leads" },
                { key: "layer3", name: "3. Proposta Enviada", stages: ["proposal"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "layer4", name: "4. Em Negociação", stages: ["negotiating"], color: "var(--color-orange)", bg: "rgba(249, 115, 22, 0.08)", text: "Leads" },
                { key: "layer5", name: "5. Fechados (Won)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" }
            ],
            6: [
                { key: "layer1", name: "1. Novos Leads", stages: ["lead"], color: "var(--color-primary)", bg: "rgba(0, 140, 255, 0.08)", text: "Leads" },
                { key: "layer2", name: "2. Contatados", stages: ["contacted"], color: "var(--color-purple)", bg: "rgba(168, 85, 247, 0.08)", text: "Leads" },
                { key: "layer3", name: "3. Proposta Enviada", stages: ["proposal"], color: "var(--color-warning)", bg: "rgba(250, 180, 0, 0.04)", text: "Leads" },
                { key: "layer4", name: "4. Em Negociação", stages: ["negotiating"], color: "var(--color-orange)", bg: "rgba(249, 115, 22, 0.08)", text: "Leads" },
                { key: "layer5", name: "5. Fechados (Won)", stages: ["won"], color: "var(--color-teal)", bg: "rgba(13, 242, 201, 0.04)", text: "Clientes" },
                { key: "layer6", name: "6. Perdidos (Lost)", stages: ["lost"], color: "var(--color-danger)", bg: "rgba(239, 68, 68, 0.08)", text: "Contatos" }
            ]
        };

        const layersCount = env.funnelLayers || 3;
        const layers = funnelConfig[layersCount] || funnelConfig[3];
        
        const layerKeys = layers.map(l => l.key);
        if (!state.activeFunnelSegment || !layerKeys.includes(state.activeFunnelSegment)) {
            state.activeFunnelSegment = layerKeys[0];
        }

        const svg = document.getElementById("funnelSvg");
        if (svg) {
            svg.innerHTML = `
                <defs>
                    <filter id="shadow-glow-layer" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
                    </filter>
                </defs>
            `;
            
            const W_top = 280;
            const W_bottom = 50;
            const H = 290;
            const margin = 8;
            const N = layers.length;
            const h_slice = (H - (N - 1) * margin) / N;

            layers.forEach((layer, i) => {
                const y1 = i * (h_slice + margin) + 10;
                const y2 = y1 + h_slice;
                
                const w1 = W_top - (y1 / H) * (W_top - W_bottom);
                const w2 = W_top - (y2 / H) * (W_top - W_bottom);
                
                const x_tl = 150 - w1/2;
                const x_tr = 150 + w1/2;
                const x_br = 150 + w2/2;
                const x_bl = 150 - w2/2;
                
                const layerContacts = filteredContacts.filter(c => layer.stages.includes(c.status));
                const count = layerContacts.length;
                const valueSum = layerContacts.reduce((sum, c) => sum + (c.value || 0), 0);
                
                const isSelected = state.activeFunnelSegment === layer.key;
                
                const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.setAttribute("points", `${x_tl},${y1} ${x_tr},${y1} ${x_br},${y2} ${x_bl},${y2}`);
                
                if (isSelected) {
                    polygon.setAttribute("fill", layer.bg);
                    polygon.setAttribute("stroke", layer.color);
                    polygon.setAttribute("stroke-width", "2");
                    polygon.setAttribute("filter", "url(#shadow-glow-layer)");
                } else {
                    polygon.setAttribute("fill", "var(--bg-card)");
                    polygon.setAttribute("stroke", "var(--border-color)");
                    polygon.setAttribute("stroke-width", "1");
                }
                
                polygon.setAttribute("style", "cursor: pointer; transition: all 0.2s;");
                
                polygon.onmouseover = () => {
                    if (!isSelected) {
                        polygon.setAttribute("fill", layer.bg);
                        polygon.setAttribute("stroke", layer.color);
                    }
                };
                polygon.onmouseout = () => {
                    if (!isSelected) {
                        polygon.setAttribute("fill", "var(--bg-card)");
                        polygon.setAttribute("stroke", "var(--border-color)");
                    }
                };
                
                polygon.onclick = () => {
                    state.activeFunnelSegment = layer.key;
                    renderAll();
                };
                
                svg.appendChild(polygon);
                
                const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                foreign.setAttribute("x", (150 - w1/2).toString());
                foreign.setAttribute("y", y1.toString());
                foreign.setAttribute("width", w1.toString());
                foreign.setAttribute("height", h_slice.toString());
                foreign.setAttribute("style", "pointer-events: none;");
                
                foreign.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; text-align:center; font-family:inherit; pointer-events:none; line-height: 1.15; padding: 2px;">
                        <strong style="font-size: 8px; color: ${isSelected ? layer.color : 'var(--text-muted)'}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">${layer.name}</strong>
                        <span style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin: 1px 0;">${count} ${layer.text}</span>
                        <span style="font-size: 8px; color: var(--text-secondary);">${formatCurrency(valueSum)}</span>
                    </div>
                `;
                
                svg.appendChild(foreign);
            });
        }

        const activeLayer = layers.find(l => l.key === state.activeFunnelSegment) || layers[0];
        const activeLeads = filteredContacts.filter(c => activeLayer.stages.includes(c.status));

        const segmentTitleEl = document.getElementById("funnelSegmentTitle");
        if (segmentTitleEl) {
            segmentTitleEl.innerText = `Contatos em ${activeLayer.name}`;
            segmentTitleEl.style.color = activeLayer.color;
        }

        const segmentBadge = document.getElementById("funnelSegmentBadgeCount");
        if (segmentBadge) {
            segmentBadge.innerText = `${activeLeads.length} contatos`;
        }

        const container = document.getElementById("funnelSegmentLeadsContainer");
        if (container) {
            container.innerHTML = "";
            if (activeLeads.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--text-muted); font-size:11px;">Nenhum lead nesta etapa com as configurações filtradas.</div>`;
            } else {
                activeLeads.forEach(c => {
                    const card = document.createElement("div");
                    card.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:12px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: all 0.2s;";
                    card.innerHTML = `
                        <div>
                            <strong style="color:var(--text-primary); font-size:12px;">${c.name}</strong>
                            <div style="font-size:10px; color:var(--text-muted);">${c.company || "Sem Empresa"} • ${c.niche || "Outro"}</div>
                        </div>
                        <div style="text-align:right;">
                            <strong style="color:var(--color-primary); font-size:11px;">${formatCurrency(c.value)}</strong>
                            <div style="font-size:9px; color:var(--text-secondary);">${translateStatus(c.status)}</div>
                        </div>
                    `;
                    card.onmouseenter = () => { card.style.borderColor = "var(--color-primary)"; card.style.background = "var(--bg-card-hover)"; };
                    card.onmouseleave = () => { card.style.borderColor = "var(--border-color)"; card.style.background = "var(--bg-app)"; };
                    card.onclick = () => openContactDetails(c.id);
                    container.appendChild(card);
                });
            }
        }
    }

    // Render columns
    stages.forEach(stage => {
        const columnContainer = document.getElementById(`kanban-${stage}`);
        const countBadge = document.getElementById(`count-${stage}`);
        columnContainer.innerHTML = "";

        // Get contacts in stage after filters
        let contactsInStage = filteredContacts.filter(c => c.status === stage);
        countBadge.innerText = contactsInStage.length;

        contactsInStage.forEach(c => {
            const card = document.createElement("div");
            card.className = "kanban-card";
            card.setAttribute("draggable", "true");
            card.setAttribute("data-id", c.id);
            card.setAttribute("data-status", c.status);
            
            card.innerHTML = `
                <div class="kanban-card-drag-handle">
                    <i data-lucide="grip-vertical" style="width:14px; height:14px;"></i>
                </div>
                <div class="kanban-card-content">
                    <h4 class="kanban-card-title">${c.name}</h4>
                    <div class="kanban-card-company">${c.company || "Sem Empresa"} <small style="color:var(--text-muted);font-size:9px;">(${c.niche || "Outro"})</small></div>
                    <div class="kanban-card-footer">
                        <span class="kanban-card-value">${formatCurrency(c.value)}</span>
                        <span class="kanban-card-days">${getDaysSince(c.createdAt)}</span>
                    </div>
                </div>
            `;

            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", c.id);
                card.classList.add("dragging");
                document.body.classList.add("dragging-active");
                
                // Highlight other columns
                document.querySelectorAll(".kanban-column").forEach(col => {
                    if (col.getAttribute("data-status") !== c.status) {
                        col.classList.add("eligible-kanban-drop");
                    }
                });
            });

            card.addEventListener("dragend", () => {
                card.classList.remove("dragging");
                document.body.classList.remove("dragging-active");
                document.querySelectorAll(".kanban-column").forEach(col => {
                    col.classList.remove("eligible-kanban-drop", "drag-hover");
                });
            });

            card.addEventListener("dblclick", () => openContactDetails(c.id));

            columnContainer.appendChild(card);
        });
    });

    // Make columns drop targets
    document.querySelectorAll(".kanban-column").forEach(column => {
        column.addEventListener("dragenter", (e) => {
            e.preventDefault();
            if (column.classList.contains("eligible-kanban-drop")) {
                column.classList.add("drag-hover");
            }
        });

        column.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        column.addEventListener("dragleave", () => {
            column.classList.remove("drag-hover");
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.classList.remove("drag-hover");
            const id = e.dataTransfer.getData("text/plain");
            const newStatus = column.getAttribute("data-status");
            
            updateContactStatus(id, newStatus);
        });
    });
}

function updateContactStatus(id, newStatus) {
    const env = getEnv();
    const contact = env.contacts.find(c => c.id === id);
    if (contact && contact.status !== newStatus) {
        if (newStatus === "won") {
            openConversionModal(contact.id);
        } else {
            const oldStatusText = translateStatus(contact.status);
            const newStatusText = translateStatus(newStatus);
            contact.status = newStatus;
            
            contact.timeline.push({
                id: "act_" + Date.now(),
                type: "note",
                description: `Funil atualizado de [${oldStatusText}] para [${newStatusText}]`,
                timestamp: new Date().toISOString()
            });

            saveState();
            renderAll();
            showToast(`O lead "${contact.name}" foi movido para "${newStatusText}".`, 'success');
        }
    }
}

// 4. Customers Management Render
// State for customers tab filter
let custTabFilter = 'active';

function renderCustomers() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    // Bind tab buttons
    const tabBtns = document.querySelectorAll('.customers-tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.custtab === custTabFilter);
        btn.onclick = () => { custTabFilter = btn.dataset.custtab; renderCustomers(); };
    });
    
    let filtered = [...env.customers];
    
    // Filter by tab
    if (custTabFilter === 'active') filtered = filtered.filter(c => c.status === 'active');
    else if (custTabFilter === 'inactive') filtered = filtered.filter(c => c.status !== 'active');
    
    if (searchVal) {
        filtered = filtered.filter(cust => 
            (cust.name || '').toLowerCase().includes(searchVal) ||
            (cust.company && cust.company.toLowerCase().includes(searchVal)) ||
            (cust.niche && cust.niche.toLowerCase().includes(searchVal)) ||
            (cust.productName || '').toLowerCase().includes(searchVal)
        );
    }
    
    // Financials calculations
    const activeCustomers = filtered.filter(c => c.status === "active");
    const mrrTotal = activeCustomers
        .filter(c => c.type === "monthly")
        .reduce((sum, c) => sum + c.value, 0);

    const ltvTotal = filtered.reduce((sum, cust) => {
        if (cust.status === "active") {
            return sum + (cust.type === "monthly" ? cust.value * 6 : cust.type === "yearly" ? cust.value : cust.value);
        }
        return sum + (cust.type === "single" ? cust.value : 0);
    }, 0);

    // Calculate unique active clients (by company name, or contact name if no company)
    const uniqueActiveClients = new Set();
    activeCustomers.forEach(c => {
        const nameKey = String(c.company || c.name || "").trim().toLowerCase();
        if (nameKey) uniqueActiveClients.add(nameKey);
    });

    // Update DOM
    document.getElementById("kpiMRR").innerText = formatCurrency(mrrTotal);
    document.getElementById("kpiCustomerLTV").innerText = formatCurrency(ltvTotal);
    document.getElementById("kpiActiveCustomers").innerText = uniqueActiveClients.size;

    const tbody = document.getElementById("customersTableBody");
    const emptyState = document.getElementById("customersEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("customersTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("customersTable").classList.remove("hidden");

        // Group services by client company (or name if no company)
        const grouped = [];
        filtered.forEach(cust => {
            const key = String(cust.company || cust.name || "").trim();
            let existing = grouped.find(g => String(g.company || g.clientName || "").trim() === key);
            if (!existing) {
                existing = {
                    clientName: cust.name,
                    company: cust.company,
                    niche: cust.niche,
                    services: [],
                    status: "inactive"
                };
                grouped.push(existing);
            }
            existing.services.push(cust);
            if (cust.status === "active") {
                existing.status = "active";
            }
        });

        grouped.forEach(group => {
            const tr = document.createElement("tr");
            
            const totalActiveValue = group.services
                .filter(s => s.status === "active")
                .reduce((sum, s) => sum + s.value, 0);

            const mrrValue = group.services
                .filter(s => s.status === "active" && s.type === "monthly")
                .reduce((sum, s) => sum + s.value, 0);

            const key = String(group.company || group.clientName || "").trim();
            const serviceCountText = `${group.services.length} ${group.services.length === 1 ? 'Serviço' : 'Serviços'}`;

            const allContactIds = [];
            group.services.forEach(s => {
                const ids = s.contactIds || (s.contactId ? [s.contactId] : []);
                ids.forEach(id => {
                    if (id && !allContactIds.includes(id)) {
                        allContactIds.push(id);
                    }
                });
            });

            const contactNames = allContactIds
                .map(id => {
                    const c = env.contacts.find(x => x.id === id);
                    return c ? c.name : null;
                })
                .filter(Boolean);

            tr.innerHTML = `
                <td>
                    <div class="col-contact-info">
                        <div class="contact-avatar">${getInitials(group.company || group.clientName)}</div>
                        <div>
                            <span style="font-weight: 600; display: block; font-size:13px;">${group.company || group.clientName || '-'}</span>
                        </div>
                    </div>
                </td>
                <td><span class="niche-tag">${group.niche || 'Outro'}</span></td>
                <td>
                    <button class="btn btn-secondary btn-xs btn-view-client-services" style="font-size: 11px; padding: 4px 10px; display: inline-flex; align-items: center; gap: 6px; border-radius: 4px;">
                        <i data-lucide="list" style="width:12px;height:12px;"></i>
                        <span>${serviceCountText}</span>
                    </button>
                </td>
                <td><strong style="color:var(--color-teal);">${formatCurrency(mrrValue)}/mês</strong></td>
                <td><strong>${formatCurrency(totalActiveValue)}</strong></td>
                <td>
                    <span class="badge-status ${group.status}">
                        ${group.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="kanban-card-actions" style="display: flex; gap: 6px;">
                        <button class="btn-icon-only btn-edit-customer" title="Editar Cliente" data-key="${key}"><i data-lucide="pencil" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-toggle-customer-status" title="${group.status === 'active' ? 'Inativar' : 'Ativar'}" data-key="${key}">
                            <i data-lucide="${group.status === 'active' ? 'user-x' : 'user-check'}" style="width:13px;height:13px;"></i>
                        </button>
                        <button class="btn btn-secondary btn-xs btn-add-service-to-client" style="font-size: 10px; padding: 4px 8px; display: flex; align-items: center; gap: 4px;">
                            <i data-lucide="plus" style="width:10px;height:10px;"></i> Serviço
                        </button>
                    </div>
                </td>
            `;

            // Bind click to open details modal
            tr.querySelector(".btn-view-client-services").onclick = () => {
                openClientServicesModal(key);
            };

            // Bind edit customer button
            tr.querySelector(".btn-edit-customer").onclick = () => {
                openEditCustomerModal(key, group);
            };

            // Bind toggle status button
            tr.querySelector(".btn-toggle-customer-status").onclick = () => {
                // Toggle all services in this group
                const newStatus = group.status === 'active' ? 'inactive' : 'active';
                group.services.forEach(s => {
                    const cust = env.customers.find(c => c.id === s.id);
                    if (cust) cust.status = newStatus;
                });
                saveState();
                renderCustomers();
                showToast(`Cliente ${newStatus === 'active' ? 'ativado' : 'inativado'} com sucesso!`, 'success');
            };

            // Bind quick add service button
            tr.querySelector(".btn-add-service-to-client").onclick = () => {
                openAddCustomer({
                    contactId: group.services[0].contactId,
                    contactIds: allContactIds,
                    name: group.clientName,
                    company: group.company,
                    niche: group.niche
                });
            };

            tbody.appendChild(tr);
        });
        
        safeCreateIcons();
    }
}

function toggleCustomerStatus(id) {
    const env = getEnv();
    const cust = env.customers.find(c => c.id === id);
    if (cust) {
        cust.status = cust.status === "active" ? "inactive" : "active";
        saveState();
        renderAll();
    }
}

function deleteCustomer(id) {
    if (confirm("Deseja realmente remover este registro de faturamento/cliente?")) {
        const env = getEnv();
        env.customers = env.customers.filter(c => c.id !== id);
        saveState();
        renderAll();
    }
}

// Open edit customer modal
function openEditCustomerModal(key, group) {
    const env = getEnv();
    document.getElementById('editCustomerKey').value = key;
    document.getElementById('editCustomerCompany').value = group.company || '';
    document.getElementById('editCustomerStatus').value = group.status || 'active';
    
    // Populate niche dropdown
    const nicheSelect = document.getElementById('editCustomerNiche');
    nicheSelect.innerHTML = (env.niches || []).map(n => 
        `<option value="${n}" ${n === group.niche ? 'selected' : ''}>${n}</option>`
    ).join('');
    
    document.getElementById('editCustomerModal').classList.add('active');
}

// Render niches list in the manage modal
function renderNichesList() {
    const env = getEnv();
    const list = document.getElementById('nichesList');
    if (!list) return;
    list.innerHTML = (env.niches || []).map(n => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-app);border:1px solid var(--border-color);border-radius:var(--radius-sm);">
            <span style="font-size:13px;font-weight:500;">${n}</span>
            <button class="btn-icon-only btn-remove-niche" data-niche="${n}" title="Remover">
                <i data-lucide="x" style="width:12px;height:12px;"></i>
            </button>
        </div>
    `).join('');
    // Bind remove buttons
    list.querySelectorAll('.btn-remove-niche').forEach(btn => {
        btn.onclick = () => {
            const niche = btn.dataset.niche;
            env.niches = env.niches.filter(n => n !== niche);
            saveState();
            renderNichesList();
        };
    });
    safeCreateIcons();
}

// 5. Products Management Render
// 5. Products Management Render
function renderProducts() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    // Default any product with undefined isCore:
    // If it is referenced as a suggested addon by any other product, default isCore to false (subproduct).
    // Otherwise, default to true (core product).
    const allSuggestedAddonIds = new Set();
    env.products.forEach(p => {
        if (p.suggestedAddons) {
            p.suggestedAddons.forEach(aid => allSuggestedAddonIds.add(aid));
        }
    });

    let stateChanged = false;
    env.products.forEach(p => {
        if (allSuggestedAddonIds.has(p.id)) {
            if (p.isCore !== false) {
                p.isCore = false;
                stateChanged = true;
            }
        } else if (p.isCore === undefined) {
            p.isCore = true;
            stateChanged = true;
        }
    });

    if (stateChanged) {
        saveState();
    }

    let filtered = [...env.products];
    if (searchVal) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchVal) ||
            p.description.toLowerCase().includes(searchVal)
        );
    }

    const coreList = filtered.filter(p => p.isCore === true);
    const subList = filtered.filter(p => p.isCore === false);

    const coreTbody = document.getElementById("coreProductsTableBody");
    const subTbody = document.getElementById("subProductsTableBody");
    const coreEmpty = document.getElementById("coreProductsEmptyState");
    const subEmpty = document.getElementById("subProductsEmptyState");

    if (!coreTbody || !subTbody) return;

    coreTbody.innerHTML = "";
    subTbody.innerHTML = "";

    // 1. Render Core Products
    if (coreList.length === 0) {
        coreEmpty.classList.remove("hidden");
        document.getElementById("coreProductsTable").classList.add("hidden");
    } else {
        coreEmpty.classList.add("hidden");
        document.getElementById("coreProductsTable").classList.remove("hidden");

        coreList.forEach(p => {
            const tr = document.createElement("tr");
            tr.dataset.id = p.id;
            tr.setAttribute("draggable", "true");
            tr.style.cursor = "grab";
            
            tr.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", p.id);
                e.dataTransfer.setData("action", "convert-to-sub");
                tr.classList.add("subproduct-drag-active");
                
                const subCard = document.getElementById("subProductsCard");
                if (subCard) {
                    subCard.classList.add("subproducts-table-unlink-active");
                }
            });
            tr.addEventListener("dragend", () => {
                tr.classList.remove("subproduct-drag-active");
                const subCard = document.getElementById("subProductsCard");
                if (subCard) {
                    subCard.classList.remove("subproducts-table-unlink-active");
                    subCard.classList.remove("subproducts-table-unlink-over");
                }
            });
            
            const hasAddons = p.suggestedAddons && p.suggestedAddons.length > 0;
            const expandBtn = hasAddons
                ? `<button class="btn-icon-only btn-expand-subproducts" style="margin-right:8px; cursor:pointer;" data-id="${p.id}"><i data-lucide="chevron-right" style="width:14px; height:14px; vertical-align:middle;"></i></button>`
                : `<span style="display:inline-block; width:22px; margin-right:8px;"></span>`;

            tr.innerHTML = `
                <td style="vertical-align: middle; padding-left: 8px;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div class="product-drag-handle" style="color: var(--text-muted); cursor: grab; padding: 2px;">
                            <i data-lucide="grip-vertical" style="width: 14px; height: 14px; vertical-align: middle;"></i>
                        </div>
                        ${expandBtn}
                    </div>
                </td>
                <td>
                    <strong style="font-size:12px; color:var(--text-primary);">${p.name}</strong>
                </td>
                <td>
                    <div style="font-size:11px;">
                        ${formatProductPriceHtml(p)}
                    </div>
                </td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                        <button class="btn-icon-only btn-edit-product" title="Editar" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                        <button class="btn-icon-only btn-delete-product" title="Excluir" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-edit-product").addEventListener("click", () => openEditProduct(p.id));
            tr.querySelector(".btn-delete-product").addEventListener("click", () => deleteProduct(p.id));

            // Drag and drop dropzone handlers
            tr.addEventListener("dragover", (e) => {
                e.preventDefault();
                tr.classList.add("dropzone-target-over");
            });
            tr.addEventListener("dragleave", () => {
                tr.classList.remove("dropzone-target-over");
            });
            tr.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation(); // stop bubbling
                tr.classList.remove("dropzone-target-over");
                const subId = e.dataTransfer.getData("text/plain");
                if (subId && subId !== p.id) {
                    p.suggestedAddons = p.suggestedAddons || [];
                    if (!p.suggestedAddons.includes(subId)) {
                        p.suggestedAddons.push(subId);
                        saveState();
                        renderAll();
                        
                        const subProd = env.products.find(x => x.id === subId);
                        const subProdName = subProd ? subProd.name : "Subproduto";
                        showToast(`"${subProdName}" vinculado a "${p.name}" com sucesso!`, 'success');
                    } else {
                        showToast(`"${p.name}" já possui este subproduto vinculado.`, 'warning');
                    }
                }
            });

            coreTbody.appendChild(tr);

            // Nested subproducts row
            if (hasAddons) {
                const subTr = document.createElement("tr");
                subTr.id = `subproducts-row-${p.id}`;
                subTr.className = "hidden";
                subTr.style.background = "var(--bg-app)";

                const addonItems = p.suggestedAddons
                    .map(aid => env.products.find(x => x.id === aid))
                    .filter(Boolean);

                const addonsListHtml = addonItems.map(item => `
                    <div class="linked-subproduct-item" draggable="true" data-main-id="${p.id}" data-sub-id="${item.id}">
                        <span style="color:var(--text-primary); font-weight:500;">🔗 ${item.name} <span style="font-size:9px;color:var(--text-muted);font-weight:400;margin-left:4px;">(arraste p/ fora p/ desvincular)</span></span>
                        <div style="display:flex; gap:12px; align-items:center;">
                            <span class="badge-recurrence ${item.type}" style="font-size:8px; padding:1px 4px;">${item.type === 'monthly' ? 'Mensal' : 'Único'}</span>
                            <strong style="color:var(--text-secondary);">${formatCurrency(item.price)}</strong>
                            <button class="btn-unlink-subproduct" data-main-id="${p.id}" data-sub-id="${item.id}" title="Remover Vínculo" style="background:transparent; border:none; color:var(--color-danger); cursor:pointer; padding:2px; display:inline-flex; align-items:center; justify-content:center;"><i data-lucide="x" style="width:10px;height:10px;"></i></button>
                        </div>
                    </div>
                `).join('');

                subTr.innerHTML = `
                    <td colspan="4" style="padding: 0 0 12px 24px; border-top:none;">
                        <div style="border-left:3px solid var(--color-primary); background:var(--bg-card); border-radius: var(--radius-sm); border-top:1px solid var(--border-color); border-right:1px solid var(--border-color); border-bottom:1px solid var(--border-color); padding: 8px 0; margin-top: 4px; box-shadow: var(--shadow-sm);">
                            <div style="padding: 4px 12px 8px 12px; font-weight:600; font-size:10px; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--border-color);">Subprodutos recomendados vinculados:</div>
                            ${addonsListHtml}
                        </div>
                    </td>
                `;
                
                // Bind unlink buttons click
                subTr.querySelectorAll(".btn-unlink-subproduct").forEach(btn => {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        unlinkSubproduct(btn.dataset.mainId, btn.dataset.subId);
                        const subProd = env.products.find(x => x.id === btn.dataset.subId);
                        const subProdName = subProd ? subProd.name : "Subproduto";
                        showToast(`Vínculo de "${subProdName}" removido com sucesso!`, 'info');
                    };
                });

                // Bind drag unlink triggers on the linked subproduct item
                subTr.querySelectorAll(".linked-subproduct-item").forEach(itemEl => {
                    itemEl.addEventListener("dragstart", (e) => {
                        const mainId = itemEl.dataset.mainId;
                        const subId = itemEl.dataset.subId;
                        e.dataTransfer.setData("application/json", JSON.stringify({ action: "unlink", mainId, subId }));
                        e.dataTransfer.setData("text/plain", subId);
                        itemEl.style.opacity = "0.4";
                        
                        const subCard = document.getElementById("subProductsCard");
                        if (subCard) {
                            subCard.classList.add("subproducts-table-unlink-active");
                        }
                    });
                    itemEl.addEventListener("dragend", () => {
                        itemEl.style.opacity = "";
                        const subCard = document.getElementById("subProductsCard");
                        if (subCard) {
                            subCard.classList.remove("subproducts-table-unlink-active");
                            subCard.classList.remove("subproducts-table-unlink-over");
                        }
                    });
                });

                coreTbody.appendChild(subTr);

                const toggleBtn = tr.querySelector(".btn-expand-subproducts");
                if (toggleBtn) {
                    toggleBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const row = document.getElementById(`subproducts-row-${p.id}`);
                        if (row) {
                            if (row.classList.contains("hidden")) {
                                row.classList.remove("hidden");
                                toggleBtn.classList.add("expanded");
                            } else {
                                row.classList.add("hidden");
                                toggleBtn.classList.remove("expanded");
                            }
                        }
                    });
                }
            }
        });
    }

    // 2. Render Subproducts
    if (subList.length === 0) {
        subEmpty.classList.remove("hidden");
        document.getElementById("subProductsTable").classList.add("hidden");
    } else {
        subEmpty.classList.add("hidden");
        document.getElementById("subProductsTable").classList.remove("hidden");

        subList.forEach(p => {
            const tr = document.createElement("tr");
            tr.setAttribute("draggable", "true");
            tr.style.cursor = "grab";
            
            // Drag start
            tr.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", p.id);
                e.dataTransfer.setData("action", "link");
                tr.classList.add("subproduct-drag-active");
                
                const coreCard = document.getElementById("coreProductsCard");
                if (coreCard) {
                    coreCard.classList.add("dropzone-target-active");
                }
                
                // Highlight eligible core rows
                document.querySelectorAll("#coreProductsTableBody tr:not([id^='subproducts-row-'])").forEach(row => {
                    row.classList.add("dropzone-target-active");
                });
            });
            tr.addEventListener("dragend", () => {
                tr.classList.remove("subproduct-drag-active");
                
                const coreCard = document.getElementById("coreProductsCard");
                if (coreCard) {
                    coreCard.classList.remove("dropzone-target-active", "dropzone-target-over");
                }
                
                document.querySelectorAll("#coreProductsTableBody tr").forEach(row => {
                    row.classList.remove("dropzone-target-active", "dropzone-target-over");
                });
            });

            tr.innerHTML = `
                <td style="vertical-align: middle; padding-left: 8px;">
                    <div class="product-drag-handle">
                        <i data-lucide="grip-vertical" style="width: 14px; height: 14px;"></i>
                    </div>
                </td>
                <td>
                    <div>
                        <strong style="font-size:12px; color:var(--text-primary);">${p.name}</strong>
                        ${p.description ? `<div style="font-size:10px; color:var(--text-muted); font-style:italic;">${p.description}</div>` : ''}
                    </div>
                </td>
                <td>
                    <div style="font-size:11px;">
                        ${formatProductPriceHtml(p)}
                    </div>
                </td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                        <button class="btn-icon-only btn-edit-product" title="Editar" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                        <button class="btn-icon-only btn-delete-product" title="Excluir" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-edit-product").addEventListener("click", () => openEditProduct(p.id));
            tr.querySelector(".btn-delete-product").addEventListener("click", () => deleteProduct(p.id));

            subTbody.appendChild(tr);
        });
    }

    const subCard = document.getElementById("subProductsCard");
    if (subCard && !subCard.dataset.dragInitialized) {
        subCard.dataset.dragInitialized = "true";
        subCard.addEventListener("dragover", (e) => {
            e.preventDefault();
            subCard.classList.add("subproducts-table-unlink-over");
        });
        subCard.addEventListener("dragleave", () => {
            subCard.classList.remove("subproducts-table-unlink-over");
        });
        subCard.addEventListener("drop", (e) => {
            e.preventDefault();
            subCard.classList.remove("subproducts-table-unlink-over");
            subCard.classList.remove("subproducts-table-unlink-active");
            
            try {
                const dataStr = e.dataTransfer.getData("application/json");
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    if (data && data.action === "unlink") {
                        unlinkSubproduct(data.mainId, data.subId);
                        return;
                    }
                }
                
                const action = e.dataTransfer.getData("action");
                const productId = e.dataTransfer.getData("text/plain");
                if (productId && action === "convert-to-sub") {
                    const currentEnv = getEnv();
                    const p = currentEnv.products.find(x => x.id === productId);
                    if (p) {
                        p.isCore = false;
                        saveState();
                        renderAll();
                        showToast(`"${p.name}" convertido em Subproduto com sucesso!`, 'success');
                    }
                }
            } catch (err) {
                console.error("Error drop unlink:", err);
            }
        });
    }

    const coreCard = document.getElementById("coreProductsCard");
    if (coreCard && !coreCard.dataset.dragInitialized) {
        coreCard.dataset.dragInitialized = "true";
        coreCard.addEventListener("dragover", (e) => {
            e.preventDefault();
            coreCard.classList.add("dropzone-target-over");
        });
        coreCard.addEventListener("dragleave", () => {
            coreCard.classList.remove("dropzone-target-over");
        });
        coreCard.addEventListener("drop", (e) => {
            e.preventDefault();
            coreCard.classList.remove("dropzone-target-over");
            coreCard.classList.remove("dropzone-target-active");
            
            try {
                const action = e.dataTransfer.getData("action");
                const productId = e.dataTransfer.getData("text/plain");
                if (productId && action === "link") {
                    const currentEnv = getEnv();
                    const p = currentEnv.products.find(x => x.id === productId);
                    if (p) {
                        p.isCore = true;
                        saveState();
                        renderAll();
                        showToast(`"${p.name}" convertido em Produto Principal (Core) com sucesso!`, 'success');
                    }
                }
            } catch (err) {
                console.error("Error drop convert to core:", err);
            }
        });
    }

    safeCreateIcons();
}

function unlinkSubproduct(mainId, subId) {
    const env = getEnv();
    const p = env.products.find(x => x.id === mainId);
    if (p) {
        p.suggestedAddons = (p.suggestedAddons || []).filter(id => id !== subId);
        saveState();
        renderAll();
        
        const subProd = env.products.find(x => x.id === subId);
        const subProdName = subProd ? subProd.name : "Subproduto";
        showToast(`"${subProdName}" desvinculado de "${p.name}" com sucesso!`, 'info');
    }
}

function updateProductProfitDisplay() {
    const price = parseFloat(document.getElementById("productPrice")?.value) || 0;
    const cost = parseFloat(document.getElementById("productCost")?.value) || 0;
    const profit = price - cost;
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0;

    const profitEl = document.getElementById("productEstimatedProfit");
    const marginEl = document.getElementById("productEstimatedMargin");
    if (profitEl) {
        profitEl.innerText = formatCurrency(profit);
        profitEl.style.color = profit >= 0 ? "var(--color-success)" : "var(--color-danger)";
    }
    if (marginEl) {
        marginEl.innerText = `${margin}% de margem`;
        marginEl.className = profit >= 0 ? "badge-status active" : "badge-status inactive";
    }
}

function formatProductPriceHtml(p) {
    let html = `<strong>${formatCurrency(p.price)}</strong>`;
    if (p.type === 'monthly') {
        html += ` <span style="font-size: 10px; color: var(--text-muted);">/mês</span>`;
        if (p.yearlyPrice && p.yearlyPrice > 0) {
            const monthlyTotal = p.price * 12;
            const diff = monthlyTotal - p.yearlyPrice;
            if (diff > 0) {
                const pct = Math.round((diff / monthlyTotal) * 100);
                html += `<div style="font-size: 9px; color: var(--color-success); font-weight: 600; margin-top: 2px;" title="Economia de R$ ${formatCurrency(diff)} ao ano">💡 Economize ${pct}% (Anual: R$ ${formatCurrency(p.yearlyPrice)})</div>`;
            }
        }
    } else if (p.type === 'yearly') {
        html += ` <span style="font-size: 10px; color: var(--text-muted);">/ano</span>`;
    } else {
        html += ` <span style="font-size: 10px; color: var(--text-muted);">(Taxa Única)</span>`;
    }

    const cost = p.cost || 0;
    if (cost > 0) {
        const profit = p.price - cost;
        const margin = p.price > 0 ? Math.round((profit / p.price) * 100) : 0;
        const profitColor = profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)';
        html += `<div style="font-size: 10.5px; margin-top: 3px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="color: var(--text-muted);">Custo: ${formatCurrency(cost)}</span>
            <span style="color: ${profitColor}; font-weight: 600; background: var(--bg-card-hover); padding: 1px 6px; border-radius: 4px; border: 1px solid var(--border-color);" title="Lucro líquido de ${formatCurrency(profit)} (${margin}% de margem)">
                Lucro: ${formatCurrency(profit)} (${margin}%)
            </span>
        </div>`;
    }
    return html;
}

function openEditProduct(id) {
    const env = getEnv();
    const p = env.products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("productId").value = p.id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productDescription").value = p.description || "";
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productCost").value = p.cost || "";
    document.getElementById("productType").value = p.type;
    
    const isCoreInput = document.getElementById("productIsCore");
    if (isCoreInput) {
        isCoreInput.checked = (p.isCore !== false); // default to true if undefined
    }
    
    const yearlyPriceInput = document.getElementById("productYearlyPrice");
    if (yearlyPriceInput) {
        yearlyPriceInput.value = p.yearlyPrice || "";
    }

    // Load suggested addons checkboxes
    populateProductAddons(p.id);
    updateProductEconomyDisplay();
    updateProductProfitDisplay();

    // Make sure addons container is visible
    const addonsGroup = document.getElementById("productAddonsFormGroup");
    if (addonsGroup) {
        addonsGroup.classList.remove("hidden");
    }

    document.getElementById("productModalTitle").innerText = "Editar Produto";
    document.getElementById("productModal").classList.add("active");
}

function populateProductAddons(selectedProductId = "") {
    const env = getEnv();
    const container = document.getElementById("productAddonsModalContainer");
    const summary = document.getElementById("productSelectedAddonsSummary");
    const btnText = document.getElementById("btnOpenProductAddonsModalText");
    if (!container) return;
    container.innerHTML = "";

    // Show all OTHER subproducts (non-core)
    const addonCandidates = env.products.filter(p => p.id !== selectedProductId && p.isCore === false);
    if (addonCandidates.length === 0) {
        container.innerHTML = `<span style="font-size:11px;color:var(--text-muted);padding:8px;">Nenhum outro subproduto disponível no catálogo para vincular</span>`;
        if (btnText) btnText.innerText = "Selecionar Subprodutos (0)";
        if (summary) summary.style.display = "none";
        return;
    }

    // Get current product's suggested addons
    const currentProduct = env.products.find(p => p.id === selectedProductId);
    const linkedAddons = currentProduct ? (currentProduct.suggestedAddons || []) : [];

    addonCandidates.forEach(p => {
        const div = document.createElement("div");
        div.style = "display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom: 2px;";
        div.innerHTML = `
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; width:100%; padding: 4px;">
                <input type="checkbox" class="product-addon-checkbox" value="${p.id}">
                <span style="flex:1;">${p.name}</span>
                <strong style="color:var(--text-secondary);">${formatCurrency(p.price)}${p.type === 'monthly' ? '/mês' : ''}</strong>
            </label>
        `;
        const cb = div.querySelector("input");
        cb.checked = linkedAddons.includes(p.id);
        
        cb.onchange = () => {
            updateSelectedAddonsSummary();
        };
        
        container.appendChild(div);
    });

    updateSelectedAddonsSummary();
}

function updateSelectedAddonsSummary() {
    const container = document.getElementById("productAddonsModalContainer");
    const summary = document.getElementById("productSelectedAddonsSummary");
    const btnText = document.getElementById("btnOpenProductAddonsModalText");
    if (!container) return;

    const checkedBoxes = Array.from(container.querySelectorAll(".product-addon-checkbox:checked"));
    const env = getEnv();
    
    if (btnText) {
        btnText.innerText = `Selecionar Subprodutos (${checkedBoxes.length})`;
    }
    
    if (checkedBoxes.length > 0) {
        const names = checkedBoxes.map(cb => {
            const p = env.products.find(x => x.id === cb.value);
            return p ? p.name : "";
        }).filter(Boolean);
        
        if (summary) {
            summary.style.display = "block";
            summary.innerHTML = `<strong>Vínculos selecionados:</strong> ${names.join(", ")}`;
        }
    } else {
        if (summary) {
            summary.style.display = "none";
        }
    }
}

function deleteProduct(id) {
    if (confirm("Deseja realmente remover este produto do catálogo?")) {
        const env = getEnv();
        env.products = env.products.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

// 6. Tasks Management Render
// Tasks view state
let tasksView = 'list'; // 'list' or 'kanban'

function renderTasksKanban(env, tasks) {
    const kanbanPanel = document.getElementById('tasksKanbanPanel');
    if (!kanbanPanel) return;
    
    // Clear existing cards (but keep headers)
    ['kanbanColTodo', 'kanbanColDoing', 'kanbanColDone'].forEach(colId => {
        const col = document.getElementById(colId);
        if (!col) return;
        // Remove all task-kanban-cards
        col.querySelectorAll('.task-kanban-card').forEach(c => c.remove());
    });
    
    const statusMap = { todo: 'kanbanColTodo', doing: 'kanbanColDoing', done: 'kanbanColDone' };
    const counts = { todo: 0, doing: 0, done: 0 };
    
    tasks.forEach(task => {
        const kanbanStatus = task.kanbanStatus || (task.completed ? 'done' : 'todo');
        const colId = statusMap[kanbanStatus] || 'kanbanColTodo';
        const col = document.getElementById(colId);
        if (!col) return;
        
        counts[kanbanStatus] = (counts[kanbanStatus] || 0) + 1;
        
        const card = document.createElement('div');
        card.className = 'task-kanban-card';
        card.draggable = true;
        card.dataset.taskId = task.id;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const isOverdue = kanbanStatus !== 'done' && task.dueDate && task.dueDate < todayStr;
        const dateStyle = isOverdue ? 'color: var(--color-danger); font-weight: 700;' : 'color:var(--text-muted);';
        const dateLabel = task.dueDate ? `<span style="font-size:10px; ${dateStyle}">📅 ${formatDate(task.dueDate)}${isOverdue ? ' (Atrasada)' : ''}</span>` : '';
        
        let contactName = "";
        if (task.contactId) {
            const foundContact = env.contacts.find(c => c.id === task.contactId);
            if (foundContact) {
                contactName = foundContact.name;
            } else {
                const foundCustomer = env.customers.find(c => c.id === task.contactId);
                if (foundCustomer) {
                    contactName = foundCustomer.name || foundCustomer.clientName || "";
                }
            }
        }

        card.innerHTML = `
            <div style="font-size:13px;font-weight:600;margin-bottom:6px;">${task.title}</div>
            ${contactName ? `<div style="font-size:10.5px;color:var(--text-secondary);margin-bottom:4px;">👤 ${contactName}</div>` : ''}
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                <span class="task-priority-badge ${task.priority}" style="font-size:10px;">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                ${dateLabel}
            </div>
        `;
        
        card.style.cursor = 'pointer';
        card.title = "Clique para editar esta tarefa";
        card.onclick = (e) => {
            // Prevent opening if the user is dragging the card
            if (e.target.closest('.task-kanban-card')) {
                openEditTaskModal(task.id);
            }
        };

        // Drag events
        card.addEventListener('dragstart', () => { card.style.opacity = '0.5'; window._dragTaskId = task.id; });
        card.addEventListener('dragend', () => { card.style.opacity = '1'; });
        
        col.appendChild(card);
    });
    
    // Update counts
    Object.keys(counts).forEach(status => {
        const countEl = document.getElementById(`kanbanCount${status.charAt(0).toUpperCase() + status.slice(1)}`);
        if (countEl) countEl.innerText = counts[status];
    });
    
    // Drop targets on columns
    kanbanPanel.querySelectorAll('.tasks-kanban-col').forEach(col => {
        col.ondragover = e => e.preventDefault();
        col.ondrop = e => {
            e.preventDefault();
            const taskId = window._dragTaskId;
            if (!taskId) return;
            const targetStatus = col.dataset.kanbanStatus;
            const task = env.tasks.find(t => t.id === taskId);
            if (task) {
                task.kanbanStatus = targetStatus;
                task.completed = targetStatus === 'done';
                saveState();
                renderTasksKanban(env, env.tasks);
            }
        };
    });
}

function renderTasks() {
    const env = getEnv();
    const assigneeFilter = document.getElementById("filterTaskAssignee")?.value || "all";
    
    // Filter tasks by assignee first
    let baseTasks = [...env.tasks];
    if (assigneeFilter !== "all") {
        baseTasks = baseTasks.filter(t => t.assignedTo === assigneeFilter);
    }
    
    // Compute Task KPIs based on filtered tasks
    const todayStr = new Date().toISOString().split('T')[0];
    const totalCount = baseTasks.length;
    const pendingCount = baseTasks.filter(t => !t.completed).length;
    const overdueCount = baseTasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;
    const completedCount = baseTasks.filter(t => t.completed).length;

    const setTEl = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    setTEl('taskKpiTotal', totalCount);
    setTEl('taskKpiPending', pendingCount);
    setTEl('taskKpiOverdue', overdueCount);
    setTEl('taskKpiCompleted', completedCount);

    // Style the overdue KPI card to indicate attention if overdueCount > 0
    const cardTaskOverdue = document.getElementById('cardTaskOverdue');
    if (cardTaskOverdue) {
        if (overdueCount > 0) {
            cardTaskOverdue.style.borderColor = 'var(--color-danger)';
            cardTaskOverdue.style.background = 'rgba(239, 68, 68, 0.02)';
        } else {
            cardTaskOverdue.style.borderColor = '';
            cardTaskOverdue.style.background = '';
        }
    }

    // Wire KPI card clicks to filter list
    const wireCard = (cardId, filterVal) => {
        const card = document.getElementById(cardId);
        if (card) {
            card.onclick = () => {
                window.taskActiveFilterOverride = filterVal;
                document.querySelectorAll(".tasks-filters li").forEach(li => {
                    li.classList.toggle('active', li.getAttribute("data-task-filter") === (filterVal === 'overdue' ? 'pending' : filterVal));
                });
                renderTasks();
            };
        }
    };
    wireCard('cardTaskTotal', 'all');
    wireCard('cardTaskPending', 'pending');
    wireCard('cardTaskOverdue', 'overdue');
    wireCard('cardTaskCompleted', 'completed');

    // Setup view toggle
    const btnList = document.getElementById('btnTasksViewList');
    const btnKanban = document.getElementById('btnTasksViewKanban');
    const listPanel = document.getElementById('tasksListPanel');
    const kanbanPanel = document.getElementById('tasksKanbanPanel');
    
    if (btnList && btnKanban) {
        btnList.classList.toggle('active', tasksView === 'list');
        btnKanban.classList.toggle('active', tasksView === 'kanban');
        btnList.onclick = () => { tasksView = 'list'; renderTasks(); };
        btnKanban.onclick = () => { tasksView = 'kanban'; renderTasks(); };
    }
    if (listPanel) listPanel.classList.toggle('hidden', tasksView === 'kanban');
    if (kanbanPanel) kanbanPanel.classList.toggle('hidden', tasksView === 'list');
    
    if (tasksView === 'kanban') {
        renderTasksKanban(env, baseTasks);
        document.getElementById("tasksBadgeAll").innerText = baseTasks.length;
        document.getElementById("tasksBadgePending").innerText = baseTasks.filter(t => !t.completed).length;
        document.getElementById("tasksBadgeCompleted").innerText = baseTasks.filter(t => t.completed).length;
        return;
    }
    
    const activeFilter = window.taskActiveFilterOverride || document.querySelector(".tasks-filters li.active")?.getAttribute("data-task-filter") || 'all';
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...baseTasks];

    if (activeFilter === "pending") {
        filtered = filtered.filter(t => !t.completed);
    } else if (activeFilter === "completed") {
        filtered = filtered.filter(t => t.completed);
    } else if (activeFilter === "overdue") {
        filtered = filtered.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
    }

    if (searchVal) {
        filtered = filtered.filter(t => t.title.toLowerCase().includes(searchVal));
    }

    const container = document.getElementById("tasksListContainer");
    const emptyState = document.getElementById("tasksEmptyState");
    container.innerHTML = "";

    document.getElementById("tasksBadgeAll").innerText = env.tasks.length;
    document.getElementById("tasksBadgePending").innerText = env.tasks.filter(t => !t.completed).length;
    document.getElementById("tasksBadgeCompleted").innerText = env.tasks.filter(t => t.completed).length;

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        
        filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const p = { high: 3, medium: 2, low: 1 };
            if (p[b.priority] !== p[a.priority]) return p[b.priority] - p[a.priority];
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        filtered.forEach(task => {
            let contactName = "";
            if (task.contactId) {
                const foundContact = env.contacts.find(c => c.id === task.contactId);
                if (foundContact) {
                    contactName = foundContact.name;
                } else {
                    const foundCustomer = env.customers.find(c => c.id === task.contactId);
                    if (foundCustomer) {
                        contactName = foundCustomer.name || foundCustomer.clientName || "";
                    }
                }
            }
            const div = document.createElement("div");
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
            const dateStyle = isOverdue ? 'color: var(--color-danger); font-weight: 700;' : '';
            const overdueBadge = isOverdue ? `<span style="background:var(--color-danger-bg); color:var(--color-danger); font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px;">Atrasada</span>` : '';
            
            div.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-checkbox"></div>
                </label>
                <div class="task-content">
                    <span class="task-title-text">${task.title}</span>
                    <div class="task-meta">
                        ${contactName ? `<span>👤 ${contactName}</span>` : ""}
                        <span style="${dateStyle}">📅 ${formatDate(task.dueDate)}</span>
                        ${overdueBadge}
                        <span class="task-priority-badge ${task.priority}">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                    </div>
                </div>
                <button class="btn-icon-only btn-delete-task" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
            `;

            // Click content area to edit
            const contentArea = div.querySelector(".task-content");
            if (contentArea) {
                contentArea.style.cursor = "pointer";
                contentArea.title = "Clique para editar esta tarefa";
                contentArea.onclick = () => openEditTaskModal(task.id);
            }

            div.querySelector(".task-toggle").addEventListener("change", (e) => {
                toggleTaskComplete(task.id, e.target.checked);
            });
            div.querySelector(".btn-delete-task").addEventListener("click", () => {
                deleteTask(task.id);
            });

            container.appendChild(div);
        });
    }
}

function toggleTaskComplete(id, completed) {
    const env = getEnv();
    const task = env.tasks.find(t => t.id === id);
    if (task) {
        task.completed = completed;
        saveState();
        renderAll();
    }
}

function deleteTask(id) {
    if (confirm("Deseja realmente remover esta tarefa?")) {
        const env = getEnv();
        env.tasks = env.tasks.filter(t => t.id !== id);
        saveState();
        renderAll();
    }
}

// Populate UI selector dropdowns

function populateAffiliateDropdowns() {
    const affiliates = getAffiliates();
    const select = document.getElementById('contactAffiliate');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">Nenhum (Venda Direta)</option>';

    affiliates.forEach(aff => {
        const opt = document.createElement('option');
        opt.value = aff.id;
        opt.innerText = `🤝 ${aff.name} (${aff.code} - ${aff.commissionRate}%)`;
        select.appendChild(opt);
    });

    select.value = currentVal;
}
function populateContactDropdowns() {
    const env = getEnv();
    const select = document.getElementById("taskContact");
    if (select) {
        select.innerHTML = `<option value="">Nenhum Contato</option>`;
        
        // Add Leads/Contacts
        const sortedLeads = [...(env.contacts || [])].sort((a,b) => (a.name || "").localeCompare(b.name || ""));
        sortedLeads.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.innerText = `[Lead] ${c.name} (${c.company || "Sem Empresa"})`;
            select.appendChild(option);
        });

        // Add Customers/Clients
        const sortedCustomers = [...(env.customers || [])].sort((a,b) => (a.name || a.clientName || "").localeCompare(b.name || b.clientName || ""));
        sortedCustomers.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.innerText = `[Cliente] ${c.name || c.clientName || ""} (${c.company || "Sem Empresa"})`;
            select.appendChild(option);
        });
    }

    populateCustomerContactsMultiselect();
}

function populateCustomerContactsMultiselect() {
    const env = getEnv();
    const dropdown = document.getElementById("customerContactsDropdown");
    const container = document.getElementById("customerContactsItemsContainer");
    if (!dropdown || !container) return;
    
    container.innerHTML = "";
    
    const sorted = [...env.contacts].sort((a,b) => a.name.localeCompare(b.name));
    sorted.forEach(c => {
        const item = document.createElement("div");
        item.className = "multiselect-item";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = c.id;
        checkbox.id = `chk-contact-${c.id}`;
        
        const label = document.createElement("label");
        label.htmlFor = `chk-contact-${c.id}`;
        label.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
        
        item.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                const nameInput = document.getElementById("customerName");
                const companyInput = document.getElementById("customerCompany");
                const nicheInput = document.getElementById("customerNiche");
                
                if (nameInput && !nameInput.value) nameInput.value = c.name || "";
                if (companyInput && !companyInput.value) companyInput.value = c.company || "";
                if (nicheInput && (!nicheInput.value || nicheInput.value === "Outro")) nicheInput.value = c.niche || "Negócio Local";
            }
            updateContactsTriggerText();
        });
    });
    
    // Wire search filter
    const searchInput = document.getElementById("customerContactsSearch");
    if (searchInput) {
        searchInput.value = "";
        searchInput.oninput = (e) => {
            const query = e.target.value.toLowerCase();
            const items = container.querySelectorAll(".multiselect-item");
            items.forEach(item => {
                const labelText = item.querySelector("label")?.textContent.toLowerCase() || "";
                if (labelText.includes(query)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        };
        searchInput.onclick = (e) => {
            e.stopPropagation();
        };
    }
    
    updateContactsTriggerText();
}

function updateContactsTriggerText() {
    const dropdown = document.getElementById("customerContactsDropdown");
    const triggerText = document.getElementById("customerContactsTriggerText");
    if (!dropdown || !triggerText) return;
    
    const checked = Array.from(dropdown.querySelectorAll("input[type='checkbox']:checked"));
    if (checked.length === 0) {
        triggerText.innerText = "Selecione os contatos...";
    } else if (checked.length <= 2) {
        const names = checked.map(chk => {
            const label = dropdown.querySelector(`label[for='${chk.id}']`);
            return label ? label.innerText.split(" (")[0] : "";
        });
        triggerText.innerText = names.join(", ");
    } else {
        triggerText.innerText = `${checked.length} contatos selecionados`;
    }
}

function populateCustomerProductsDropdown() {
    const env = getEnv();
    const select = document.getElementById("customerProduct");
    if (!select) return;
    
    select.innerHTML = `<option value="custom">-- Serviço Customizado --</option>`;
    
    const sortedProducts = [...env.products].sort((a, b) => a.name.localeCompare(b.name));
    sortedProducts.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.innerText = `${p.name} (${formatCurrency(p.price)})`;
        select.appendChild(option);
    });
}

function populateConversionProductsDropdown() {
    const env = getEnv();
    const select = document.getElementById("conversionProduct");
    if (!select) return;
    select.innerHTML = "";
    
    env.products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.innerText = `${p.name} (Ref: ${formatCurrency(p.price)})`;
        select.appendChild(option);
    });

    const updateAddons = () => {
        const selectedId = select.value;
        const container = document.getElementById("conversionAddonsContainer");
        if (!container) return;
        container.innerHTML = "";

        // Show all other products as potential addons
        const addonCandidates = env.products.filter(p => p.id !== selectedId);
        if (addonCandidates.length === 0) {
            container.innerHTML = `<span style="font-size:11px;color:var(--text-muted);">Nenhum serviço adicional disponível</span>`;
            return;
        }

        const coreProd = env.products.find(p => p.id === selectedId);
        const suggested = coreProd ? (coreProd.suggestedAddons || []) : [];

        addonCandidates.forEach(p => {
            const div = document.createElement("div");
            div.style = "display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom: 2px;";
            div.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; width:100%;">
                    <input type="checkbox" class="conversion-addon-checkbox" value="${p.id}">
                    <span style="flex:1;">${p.name}</span>
                    <strong style="color:var(--text-secondary);">${formatCurrency(p.price)}${p.type === 'monthly' ? '/mês' : ''}</strong>
                </label>
            `;
            const cb = div.querySelector("input");
            cb.checked = suggested.includes(p.id);
            container.appendChild(div);
        });
    };

    select.addEventListener("change", (e) => {
        const prod = env.products.find(p => p.id === e.target.value);
        if (prod) {
            document.getElementById("conversionPrice").value = prod.price;
            document.getElementById("conversionType").value = prod.type;
        }
        updateAddons();
    });

    // Run initially
    if (env.products.length > 0) {
        const firstProd = env.products[0];
        document.getElementById("conversionPrice").value = firstProd.price;
        document.getElementById("conversionType").value = firstProd.type;
    }
    updateAddons();
}

function populateEventContactsDropdown() {
    const env = getEnv();
    const select = document.getElementById("eventContact");
    if (!select) return;
    select.innerHTML = `<option value="">Nenhum</option>`;
    
    const sorted = [...env.contacts].sort((a,b) => a.name.localeCompare(b.name));
    sorted.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        select.appendChild(option);
    });
}

// 7. Modals Toggles and Actions
// Contact forms
function openAddContact() {
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = "";
    document.getElementById("contactNiche").value = "Negócio Local";
    document.getElementById("contactModalTitle").innerText = "Adicionar Contato";
    document.getElementById("contactModal").classList.add("active");
}

function openEditContact(id) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === id);
    if (!c) return;

    document.getElementById("contactId").value = c.id;
    document.getElementById("contactName").value = c.name;
    document.getElementById("contactCompany").value = c.company || "";
    document.getElementById("contactEmail").value = c.email;
    document.getElementById("contactPhone").value = c.phone || "";
    document.getElementById("contactValue").value = c.value || 0;
    document.getElementById("contactStatus").value = c.status;
    document.getElementById("contactNiche").value = c.niche || "Negócio Local";
    if (document.getElementById("contactAffiliate")) document.getElementById("contactAffiliate").value = c.affiliateId || "";
    document.getElementById("contactNotes").value = c.notes || "";

    document.getElementById("contactModalTitle").innerText = "Editar Contato";
    document.getElementById("contactModal").classList.add("active");
}

function deleteContact(id) {
    if (confirm("Tem certeza que deseja excluir este contato? Esta ação apagará também o histórico de atividades.")) {
        const env = getEnv();
        env.contacts = env.contacts.filter(c => c.id !== id);
        env.tasks = env.tasks.filter(t => t.contactId !== id);
        saveState();
        renderAll();
    }
}

// Contact details and activities logs
function openContactDetails(id) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === id);
    if (!c) return;

    document.getElementById("activityContactId").value = c.id;
    document.getElementById("detailInitials").innerText = getInitials(c.name);
    document.getElementById("detailName").innerText = c.name;
    document.getElementById("detailCompany").innerText = c.company || "Sem Empresa";
    document.getElementById("detailEmail").innerText = c.email;
    document.getElementById("detailPhone").innerText = c.phone || "Não cadastrado";
    document.getElementById("detailValue").innerText = formatCurrency(c.value);
    document.getElementById("detailNiche").innerText = c.niche || "Outro";
    
    const badge = document.getElementById("detailBadgeStatus");
    badge.className = `status-badge ${c.status}`;
    badge.innerText = translateStatus(c.status);

    renderTimeline(c);
    
    const btnSendTemplate = document.getElementById("btnSendTemplateToContact");
    if (btnSendTemplate) {
        btnSendTemplate.onclick = () => {
            document.getElementById("contactDetailsModal").classList.remove("active");
            openSendTemplateModal(null, c.id);
        };
    }

    document.getElementById("contactDetailsModal").classList.add("active");
    safeCreateIcons();
}

function renderTimeline(contact) {
    const container = document.getElementById("contactTimeline");
    container.innerHTML = "";
    
    if (!contact.timeline || contact.timeline.length === 0) {
        container.innerHTML = `<p style="font-size:13px;color:var(--text-muted);text-align:center;padding:20px;">Nenhuma interação registrada.</p>`;
        return;
    }

    const sortedTimeline = [...contact.timeline].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedTimeline.forEach(act => {
        const item = document.createElement("div");
        item.className = `timeline-item ${act.type}`;
        
        let typeEmoji = "📝";
        let typeTitle = "Nota";
        if (act.type === 'call') { typeEmoji = "📞"; typeTitle = "Ligação"; }
        else if (act.type === 'email') { typeEmoji = "✉️"; typeTitle = "E-mail"; }
        else if (act.type === 'meeting') { typeEmoji = "🤝"; typeTitle = "Reunião"; }

        item.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-title">${typeEmoji} ${typeTitle}</span>
                <span class="timeline-time">${formatDate(act.timestamp)}</span>
            </div>
            <p class="timeline-desc">${act.description}</p>
        `;
        container.appendChild(item);
    });
}

// Customers form modal controls
function openAddCustomer(preFill = null) {
    document.getElementById("customerForm").reset();
    document.getElementById("customerId").value = "";
    
    // Reset date fields and document
    const startDateInput = document.getElementById("customerStartDate");
    if (startDateInput) startDateInput.value = new Date().toISOString().split("T")[0];
    const endDateInput = document.getElementById("customerEndDate");
    if (endDateInput) endDateInput.value = "";
    const lastServiceDateInput = document.getElementById("customerLastServiceDate");
    if (lastServiceDateInput) lastServiceDateInput.value = "";
    const documentUrlInput = document.getElementById("customerDocumentUrl");
    if (documentUrlInput) documentUrlInput.value = "";
    
    const dropdown = document.getElementById("customerContactsDropdown");
    if (dropdown) {
        const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => chk.checked = false);
    }
    
    if (preFill) {
        document.getElementById("customerName").value = preFill.name || "";
        document.getElementById("customerCompany").value = preFill.company || "";
        document.getElementById("customerNiche").value = preFill.niche || "Negócio Local";
        
        if (dropdown) {
            const targetIds = preFill.contactIds || (preFill.contactId ? [preFill.contactId] : []);
            targetIds.forEach(id => {
                const chk = dropdown.querySelector(`input[value='${id}']`);
                if (chk) chk.checked = true;
            });
        }
        
        if (preFill.startDate && startDateInput) startDateInput.value = preFill.startDate;
        if (preFill.endDate && endDateInput) endDateInput.value = preFill.endDate;
        if (preFill.lastServiceDate && lastServiceDateInput) lastServiceDateInput.value = preFill.lastServiceDate;
        if (preFill.documentUrl && documentUrlInput) documentUrlInput.value = preFill.documentUrl;
    } else {
        document.getElementById("customerName").value = "";
        document.getElementById("customerCompany").value = "";
        document.getElementById("customerNiche").value = "Negócio Local";
    }
    
    updateContactsTriggerText();
    
    const prodSelect = document.getElementById("customerProduct");
    if (prodSelect) prodSelect.value = "custom";
    const customContainer = document.getElementById("customerProductNameCustomContainer");
    if (customContainer) customContainer.style.display = "none";
    const customInput = document.getElementById("customerProductNameCustom");
    if (customInput) {
        customInput.value = "";
        customInput.required = false;
    }
    const priceInput = document.getElementById("customerPrice");
    if (priceInput) priceInput.value = "";
    const billingInput = document.getElementById("customerBillingType");
    if (billingInput) billingInput.value = "single";
    
    const statusInput = document.getElementById("customerStatus");
    if (statusInput) statusInput.value = "active";
    
    // Populate niches dropdown dynamically
    const nicheSelect = document.getElementById("customerNiche");
    if (nicheSelect) {
        const env = getEnv();
        const currentVal = nicheSelect.value;
        nicheSelect.innerHTML = (env.niches || ["Negócio Local", "E-commerce", "Saúde / Estética", "Outro"]).map(n => 
            `<option value="${n}">${n}</option>`
        ).join('') + '<option value="custom">+ Personalizado</option>';
        // Restore value if preFill had a niche
        if (preFill && preFill.niche) nicheSelect.value = preFill.niche;
    }

    // Reset payment due date
    const dueDateInput = document.getElementById("customerPaymentDueDate");
    if (dueDateInput) dueDateInput.value = "";
    const dueDateInput2 = document.getElementById("customerPaymentDueDate2");
    if (dueDateInput2) dueDateInput2.value = "";
    const partialRow = document.getElementById("partialSecondDateRow");
    if (partialRow) partialRow.style.display = 'none';
    const payOptSel = document.getElementById("customerPaymentOption");
    if (payOptSel) payOptSel.value = 'full';
    const countBalChk = document.getElementById("customerCountBalance");
    if (countBalChk) countBalChk.checked = true;
    
    const titleInput = document.getElementById("customerModalTitle");
    if (titleInput) titleInput.innerText = "Adicionar Serviço ao Cliente";
    const modalInput = document.getElementById("customerModal");
    if (modalInput) modalInput.classList.add("active");
}

let currentDetailsClientKey = "";

function openClientServicesModal(clientKey) {
    currentDetailsClientKey = clientKey;
    const env = getEnv();
    
    const services = env.customers.filter(c => {
        const key = String(c.company || c.name || "").trim();
        return key === clientKey;
    });

    if (services.length === 0) {
        document.getElementById("clientServicesModal").classList.remove("active");
        return;
    }

    const first = services[0];
    document.getElementById("clientServicesModalSubtitle").innerText = first.company ? `${first.company} (Representante: ${first.name})` : first.name;
    
    const tbody = document.getElementById("clientServicesTableBody");
    tbody.innerHTML = "";
    
    let totalVal = 0;

    services.forEach(s => {
        const tr = document.createElement("tr");
        const badgeText = s.type === 'monthly' ? 'Mensal' : s.type === 'yearly' ? 'Anual' : 'Único';
        
        const dateText = (s.startDate ? formatDateBr(s.startDate) : '-') + ' / ' + (s.endDate ? formatDateBr(s.endDate) : '-');
        const lastServiceText = s.lastServiceDate ? formatDateBr(s.lastServiceDate) : '-';
        
        let docHtml = '-';
        if (s.documentUrl) {
            const url = s.documentUrl.startsWith('http') ? s.documentUrl : 'https://' + s.documentUrl;
            docHtml = `<a href="${url}" target="_blank" class="btn-doc-link" title="Abrir Anexo"><i data-lucide="paperclip" style="width:12px;height:12px;"></i></a>`;
        }

        tr.innerHTML = `
            <td><strong>${s.productName}</strong></td>
            <td>
                <span class="badge-recurrence ${s.type}">
                    ${badgeText}
                </span>
            </td>
            <td><strong>${formatCurrency(s.value)}</strong></td>
            <td><span style="font-size: 11px;">${dateText}</span></td>
            <td><span style="font-size: 11px;">${lastServiceText}</span></td>
            <td style="text-align: center;">${docHtml}</td>
            <td>
                <span class="badge-status ${s.status}">
                    ${s.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 4px; justify-content: flex-end;">
                    <button class="btn-icon-only btn-sm btn-edit-service" data-id="${s.id}" title="Editar" style="width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                    <button class="btn-icon-only btn-sm btn-toggle-service" data-id="${s.id}" title="Alternar Status" style="width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><i data-lucide="refresh-cw" style="width:12px;height:12px;"></i></button>
                    <button class="btn-icon-only btn-sm btn-delete-service" data-id="${s.id}" title="Excluir" style="width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                </div>
            </td>
        `;

        if (s.status === "active") {
            totalVal += s.value;
        }

        // Bind inner actions
        tr.querySelector(".btn-edit-service").onclick = () => {
            document.getElementById("clientServicesModal").classList.remove("active");
            openEditCustomer(s.id);
        };
        tr.querySelector(".btn-toggle-service").onclick = () => {
            toggleCustomerStatus(s.id);
            setTimeout(() => openClientServicesModal(clientKey), 100);
        };
        tr.querySelector(".btn-delete-service").onclick = () => {
            deleteCustomer(s.id);
            setTimeout(() => openClientServicesModal(clientKey), 100);
        };

        tbody.appendChild(tr);
    });

    document.getElementById("clientServicesTotalLabel").innerText = `Total Ativo: ${formatCurrency(totalVal)}`;
    document.getElementById("clientServicesModal").classList.add("active");
    safeCreateIcons();
}

function openEditCustomer(id) {
    const env = getEnv();
    const cust = env.customers.find(c => c.id === id);
    if (!cust) return;

    const form = document.getElementById("customerForm");
    if (form) form.reset();
    const idInput = document.getElementById("customerId");
    if (idInput) idInput.value = cust.id;
    
    // Set checkboxes for multiselect
    const dropdown = document.getElementById("customerContactsDropdown");
    if (dropdown) {
        const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => chk.checked = false);
        
        const targetIds = cust.contactIds || (cust.contactId ? [cust.contactId] : []);
        targetIds.forEach(cid => {
            const chk = dropdown.querySelector(`input[value='${cid}']`);
            if (chk) chk.checked = true;
        });
    }
    updateContactsTriggerText();

    const nameInput = document.getElementById("customerName");
    if (nameInput) nameInput.value = cust.name || "";
    const companyInput = document.getElementById("customerCompany");
    if (companyInput) companyInput.value = cust.company || "";
    const nicheInput = document.getElementById("customerNiche");
    if (nicheInput) nicheInput.value = cust.niche || "Outro";
    
    const prodSelect = document.getElementById("customerProduct");
    const customContainer = document.getElementById("customerProductNameCustomContainer");
    const customInput = document.getElementById("customerProductNameCustom");
    const priceInput = document.getElementById("customerPrice");
    const billingInput = document.getElementById("customerBillingType");
    
    let isCustom = true;
    let prodIdToSet = "custom";
    let customNameToSet = cust.productName || "";
    
    const prodId = cust.productIds && cust.productIds.length > 0 ? cust.productIds[0] : null;
    if (prodId) {
        const hasProd = env.products.some(p => p.id === prodId);
        if (hasProd) {
            isCustom = false;
            prodIdToSet = prodId;
        }
    } else if (cust.productName) {
        const matching = env.products.find(p => p.name === cust.productName);
        if (matching) {
            isCustom = false;
            prodIdToSet = matching.id;
        }
    }
    
    if (prodSelect) prodSelect.value = prodIdToSet;
    if (priceInput) priceInput.value = cust.value || 0;
    if (billingInput) billingInput.value = cust.type || "single";
    
    if (isCustom) {
        if (customContainer) customContainer.style.display = "block";
        if (customInput) {
            customInput.value = customNameToSet;
            customInput.required = true;
        }
    } else {
        if (customContainer) customContainer.style.display = "none";
        if (customInput) {
            customInput.value = "";
            customInput.required = false;
        }
    }
    
    // Set date and document fields
    const startDateInput = document.getElementById("customerStartDate");
    if (startDateInput) startDateInput.value = cust.startDate || "";
    const endDateInput = document.getElementById("customerEndDate");
    if (endDateInput) endDateInput.value = cust.endDate || "";
    const lastServiceDateInput = document.getElementById("customerLastServiceDate");
    if (lastServiceDateInput) lastServiceDateInput.value = cust.lastServiceDate || "";
    const documentUrlInput = document.getElementById("customerDocumentUrl");
    if (documentUrlInput) documentUrlInput.value = cust.documentUrl || "";

    const statusInput = document.getElementById("customerStatus");
    if (statusInput) statusInput.value = cust.status || "active";

    const titleInput = document.getElementById("customerModalTitle");
    if (titleInput) titleInput.innerText = "Editar Serviço do Cliente";
    const modalInput = document.getElementById("customerModal");
    if (modalInput) modalInput.classList.add("active");
}


// Products form
document.getElementById("btnCreateProduct").addEventListener("click", () => {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productIsCore").checked = true; // default core to true
    
    const group = document.getElementById("productAddonsFormGroup");
    if (group) group.classList.remove("hidden");

    populateProductAddons(""); // Populate empty addons list
    updateProductEconomyDisplay();
    
    document.getElementById("productModalTitle").innerText = "Adicionar Produto";
    document.getElementById("productModal").classList.add("active");
});
document.getElementById("btnCloseProductModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
});
document.getElementById("btnCancelProductModal").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
});

// Product Addons Modal Controls
document.getElementById("btnOpenProductAddonsModal").addEventListener("click", () => {
    const modal = document.getElementById("productAddonsSelectionModal");
    if (modal) {
        modal.classList.add("active");
        const searchInput = document.getElementById("searchAddonsSelection");
        if (searchInput) {
            searchInput.value = "";
            searchInput.dispatchEvent(new Event("input"));
        }
    }
});

document.getElementById("btnCloseProductAddonsModal").addEventListener("click", () => {
    document.getElementById("productAddonsSelectionModal").classList.remove("active");
});

document.getElementById("btnConfirmProductAddonsModal").addEventListener("click", () => {
    document.getElementById("productAddonsSelectionModal").classList.remove("active");
});

const searchAddonsInput = document.getElementById("searchAddonsSelection");
if (searchAddonsInput) {
    searchAddonsInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const container = document.getElementById("productAddonsModalContainer");
        if (container) {
            const labels = container.querySelectorAll("label");
            labels.forEach(label => {
                const text = label.textContent.toLowerCase();
                if (text.includes(query)) {
                    label.parentElement.style.display = "flex";
                } else {
                    label.parentElement.style.display = "none";
                }
            });
        }
    });
}

const pType = document.getElementById("productType");
const pPrice = document.getElementById("productPrice");
const pYearly = document.getElementById("productYearlyPrice");
if (pType && pPrice && pYearly) {
    const handler = () => updateProductEconomyDisplay();
    pType.addEventListener("change", handler);
    pPrice.addEventListener("input", handler);
    pYearly.addEventListener("input", handler);
}

function updateProductEconomyDisplay() {
    const type = document.getElementById("productType").value;
    const price = parseFloat(document.getElementById("productPrice").value) || 0;
    const yearlyPriceInput = document.getElementById("productYearlyPrice");
    const yearlyPriceRow = document.getElementById("yearlyPriceRow");
    const economyInfo = document.getElementById("productEconomyInfo");
    
    if (type === 'monthly') {
        if (yearlyPriceRow) yearlyPriceRow.style.display = "block";
        const yearlyPrice = parseFloat(yearlyPriceInput?.value) || 0;
        if (price > 0 && yearlyPrice > 0) {
            const monthlyTotal = price * 12;
            const diff = monthlyTotal - yearlyPrice;
            if (diff > 0) {
                const pct = Math.round((diff / monthlyTotal) * 100);
                if (economyInfo) {
                    economyInfo.style.display = "block";
                    economyInfo.innerHTML = `💡 Economia de <strong>${formatCurrency(diff)}</strong> ao ano (<strong>${pct}%</strong> de desconto no plano anual)`;
                }
            } else {
                if (economyInfo) economyInfo.style.display = "none";
            }
        } else {
            if (economyInfo) economyInfo.style.display = "none";
        }
    } else {
        if (yearlyPriceRow) yearlyPriceRow.style.display = "none";
        if (economyInfo) economyInfo.style.display = "none";
    }
}

document.getElementById("productPrice")?.addEventListener("input", updateProductProfitDisplay);
document.getElementById("productCost")?.addEventListener("input", updateProductProfitDisplay);

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = parseFloat(document.getElementById("productPrice").value) || 0;
    const cost = parseFloat(document.getElementById("productCost")?.value) || 0;
    const type = document.getElementById("productType").value;
    const isCore = document.getElementById("productIsCore")?.checked;
    const yearlyPrice = parseFloat(document.getElementById("productYearlyPrice")?.value) || 0;

    const suggestedAddons = Array.from(document.querySelectorAll(".product-addon-checkbox:checked")).map(cb => cb.value);

    if (id) {
        const p = env.products.find(x => x.id === id);
        if (p) {
            p.name = name;
            p.description = description;
            p.price = price;
            p.cost = cost;
            p.type = type;
            p.isCore = isCore;
            p.yearlyPrice = yearlyPrice;
            p.suggestedAddons = suggestedAddons;
        }
    } else {
        const newProd = {
            id: "p_" + Date.now(),
            name,
            description,
            price,
            cost,
            type,
            isCore,
            yearlyPrice,
            suggestedAddons
        };
        env.products.push(newProd);
    }
    
    saveState();
    document.getElementById("productModal").classList.remove("active");
    renderAll();
});

// Conversion Modal triggers
function openConversionModal(contactId) {
    const env = getEnv();
    const c = env.contacts.find(x => x.id === contactId);
    if (!c) return;

    document.getElementById("conversionContactId").value = c.id;
    
    const select = document.getElementById("conversionProduct");
    if (env.products.length > 0) {
        select.value = env.products[0].id;
        document.getElementById("conversionPrice").value = env.products[0].price;
        document.getElementById("conversionType").value = env.products[0].type;
    } else {
        document.getElementById("conversionPrice").value = c.value;
        document.getElementById("conversionType").value = "single";
    }

    document.getElementById("conversionModal").classList.add("active");
}

document.getElementById("btnCloseConversionModal").addEventListener("click", () => {
    document.getElementById("conversionModal").classList.remove("active");
});
document.getElementById("btnCancelConversionModal").addEventListener("click", () => {
    const env = getEnv();
    const id = document.getElementById("conversionContactId").value;
    const contact = env.contacts.find(c => c.id === id);
    if (contact) {
        const oldStatus = contact.status;
        contact.status = "won";
        contact.timeline.push({
            id: "act_" + Date.now(),
            type: "note",
            description: `Funil atualizado de [${translateStatus(oldStatus)}] para [Ganho] (faturamento não registrado)`,
            timestamp: new Date().toISOString()
        });
        saveState();
    }
    document.getElementById("conversionModal").classList.remove("active");
    renderAll();
});

document.getElementById("conversionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const contactId = document.getElementById("conversionContactId").value;
    const productId = document.getElementById("conversionProduct").value;
    const finalPrice = parseFloat(document.getElementById("conversionPrice").value) || 0;
    const billingType = document.getElementById("conversionType").value;

    const contact = env.contacts.find(c => c.id === contactId);
    const product = env.products.find(p => p.id === productId);

    if (contact && product) {
        contact.status = "won";
        contact.value = finalPrice;
        
        // Build descriptions for addons too
        const checkedAddonNames = [];
        document.querySelectorAll(".conversion-addon-checkbox:checked").forEach(cb => {
            const addProd = env.products.find(p => p.id === cb.value);
            if (addProd) checkedAddonNames.push(`${addProd.name} (${formatCurrency(addProd.price)})`);
        });

        const noteText = `Venda concluída! Produto Principal: ${product.name} (${formatCurrency(finalPrice)}).` + 
            (checkedAddonNames.length > 0 ? ` Adicionais: ${checkedAddonNames.join(", ")}.` : "");

        contact.timeline.push({
            id: "act_" + Date.now(),
            type: "note",
            description: noteText,
            timestamp: new Date().toISOString()
        });

        // Helper to register billing, invoice and contract
        const registerItem = (prodName, val, rec, suffix = "") => {
            // Add to Customers list
            const newCust = {
                id: "cust_" + Date.now() + suffix,
                contactId: contact.id,
                name: contact.name,
                company: contact.company,
                niche: contact.niche || "Outro",
                productName: prodName,
                value: val,
                type: rec,
                status: "active",
                createdAt: new Date().toISOString()
            };
            env.customers.push(newCust);

            // Auto-generate invoice
            const newInvoice = {
                id: "FAT-" + Date.now().toString().substring(8) + suffix,
                customerName: contact.name,
                company: contact.company || "-",
                niche: contact.niche || "Outro",
                productName: prodName,
                value: val,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: "pending"
            };
            env.invoices.push(newInvoice);

            // Auto-generate contract draft
            const newCon = {
                id: "CONTR-" + Date.now().toString().substring(8) + suffix,
                contactId: contact.id,
                proposalId: "DIRECT-CONV-" + Date.now().toString().substring(8),
                clientName: contact.name,
                company: contact.company || "Pessoa Física",
                productName: prodName,
                value: val,
                recurrence: rec,
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: "draft"
            };
            env.contracts.push(newCon);
        };

        // Core
        registerItem(product.name, finalPrice, billingType, "-core");

        // Addons
        document.querySelectorAll(".conversion-addon-checkbox:checked").forEach((cb, idx) => {
            const addProd = env.products.find(p => p.id === cb.value);
            if (addProd) {
                registerItem(addProd.name, addProd.price, addProd.type, `-add${idx}`);
            }
        });

        saveState();
    }

    document.getElementById("conversionModal").classList.remove("active");
    renderAll();
});

// Import Modal Triggers
function setupOpenImportButton() {
    document.getElementById("btnOpenImport").addEventListener("click", () => {
        document.getElementById("importText").value = "";
        document.getElementById("importLogsPanel").classList.add("hidden");
        document.getElementById("importLogsTableBody").innerHTML = "";
        document.getElementById("importFileName").innerText = "Nenhum arquivo selecionado";
        document.getElementById("importModal").classList.add("active");
    });
}

document.getElementById("btnCloseImportModal").addEventListener("click", () => {
    document.getElementById("importModal").classList.remove("active");
});
document.getElementById("btnCancelImportModal").addEventListener("click", () => {
    document.getElementById("importModal").classList.remove("active");
});

// Execute Lead Import (CSV parsing and duplicate check)
document.getElementById("btnExecuteImport").addEventListener("click", () => {
    const env = getEnv();
    const textData = document.getElementById("importText").value.trim();
    const logTableBody = document.getElementById("importLogsTableBody");
    logTableBody.innerHTML = "";
    
    if (!textData) {
        showToast("Por favor, cole os dados CSV na caixa de texto.", "warning");
        return;
    }

    const lines = textData.split("\n");
    if (lines.length <= 1) {
        showToast("O CSV inserido não possui registros suficientes.", "error");
        return;
    }

    const records = lines.slice(1);
    
    let successCount = 0;
    let ignoredCount = 0;
    const importLogs = [];
    
    document.getElementById("importLogsPanel").classList.remove("hidden");

    records.forEach((record, index) => {
        const lineNum = index + 2;
        if (!record.trim()) return;

        const cells = record.split(",").map(c => c.trim());
        
        // Map fields (Nome, Empresa, Email, Telefone, Valor, Nicho, Notas)
        const name = cells[0] || "";
        const company = cells[1] || "";
        const email = cells[2] || "";
        const phone = cells[3] || "";
        const value = parseFloat(cells[4]) || 0;
        const niche = cells[5] || "Outro";
        const notes = cells[6] || "";

        if (!name || (!email && !phone)) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum}</td>
                <td><span class="badge-status inactive">Ignorado</span></td>
                <td>Nome ou Canal de contato (E-mail/Telefone) ausentes no registro.</td>
            `;
            logTableBody.appendChild(tr);
            importLogs.push(`Linha ${lineNum}: Ignorado - Nome ou Contato ausentes`);
            ignoredCount++;
            return;
        }

        const duplicateEmail = email && env.contacts.some(c => c.email && c.email.toLowerCase() === email.toLowerCase());
        const duplicatePhone = phone && env.contacts.some(c => c.phone && c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));

        if (duplicateEmail) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum} (${name})</td>
                <td><span class="badge-status inactive">Duplicado</span></td>
                <td>O e-mail '${email}' já existe no ambiente.</td>
            `;
            logTableBody.appendChild(tr);
            importLogs.push(`Linha ${lineNum} (${name}): Ignorado - E-mail '${email}' já existe`);
            ignoredCount++;
            return;
        }

        if (duplicatePhone) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>Linha ${lineNum} (${name})</td>
                <td><span class="badge-status inactive">Duplicado</span></td>
                <td>O telefone '${phone}' já está cadastrado.</td>
            `;
            logTableBody.appendChild(tr);
            importLogs.push(`Linha ${lineNum} (${name}): Ignorado - Telefone '${phone}' já cadastrado`);
            ignoredCount++;
            return;
        }

        // Auto map status from notes (e.g. 🏆, ✉️, 🔥, 💬)
        let status = "lead";
        const notesLower = notes.toLowerCase();
        if (notesLower.includes("fechamento") || notesLower.includes("🏆") || notesLower.includes("ganho")) {
            status = "won";
        } else if (notesLower.includes("proposta") || notesLower.includes("✉️")) {
            status = "proposal";
        } else if (notesLower.includes("interessado") || notesLower.includes("🔥") || notesLower.includes("negociação")) {
            status = "negotiating";
        } else if (notesLower.includes("conversa") || notesLower.includes("💬") || notesLower.includes("contatado")) {
            status = "contacted";
        }

        const newContact = {
            id: "c_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            name,
            company,
            email,
            phone,
            value,
            niche,
            status,
            notes,
            createdAt: new Date().toISOString(),
            timeline: [
                { id: "act_" + Date.now(), type: "note", description: `Contato importado via planilha CSV. Estágio detectado: ${translateStatus(status)}`, timestamp: new Date().toISOString() }
            ]
        };

        env.contacts.push(newContact);
        successCount++;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>Linha ${lineNum} (${name})</td>
            <td><span class="badge-status active">Sucesso</span></td>
            <td>Lead importado com sucesso.</td>
        `;
        logTableBody.appendChild(tr);
        importLogs.push(`Linha ${lineNum} (${name}): Sucesso - Lead importado`);
    });

    // Save to history
    env.importHistory = env.importHistory || [];
    env.importHistory.push({
        id: "imp_" + Date.now(),
        date: new Date().toISOString(),
        fileName: document.getElementById("importFileName")?.innerText || "Importação Direta",
        successCount: successCount,
        failCount: ignoredCount,
        details: importLogs
    });

    saveState();
    renderAll();
    showToast(`Importação concluída. ${successCount} importados, ${ignoredCount} ignorados.`, "success");
});

// File reader parser
document.getElementById("importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("importFileName").innerText = file.name;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        if (file.name.endsWith(".json")) {
            try {
                const arr = JSON.parse(content);
                if (Array.isArray(arr)) {
                    let csvText = "Nome,Empresa,Email,Telefone,Valor,Nicho,Notas\n";
                    arr.forEach(item => {
                        csvText += `${item.name || ""},${item.company || ""},${item.email || ""},${item.phone || ""},${item.value || 0},${item.niche || "Outro"},${item.notes || ""}\n`;
                    });
                    document.getElementById("importText").value = csvText;
                } else {
                    showToast("JSON inválido: deve ser uma lista de objetos.", "error");
                }
            } catch (err) {
                showToast("Erro ao ler JSON: " + err.message, "error");
            }
        } else {
            document.getElementById("importText").value = content;
        }
    };
    reader.readAsText(file);
});

// Login overlay Form submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const errorMsg = document.getElementById("loginErrorMsg");

    const env = getEnv();
    if (!env.users) {
        env.users = [{ username: "Admin", password: "080125", name: "Admin", role: "Administrador" }];
        saveState();
    }

    const matchedUser = env.users.find(u => u.username.toLowerCase() === user.toLowerCase() && u.password === pass);

    if (matchedUser) {
        sessionStorage.setItem("nexus_crm_logged_in", "true");
        sessionStorage.setItem("nexus_crm_env", "webco");
        sessionStorage.setItem("nexus_crm_username", matchedUser.username);
        state.currentEnv = "webco";
        
        errorMsg.classList.add("hidden");
        document.getElementById("loginOverlay").classList.add("hidden");
        document.getElementById("appContainer").classList.remove("hidden");
        document.getElementById("appContainer").classList.add("logged-in");
        document.getElementById("sidebarUsername").innerText = matchedUser.name || matchedUser.username;
        
        ensureParanaEcoturismo();
        renderAll();
        const savedView = localStorage.getItem("nexus_crm_active_view") || "dashboard";
        switchView(savedView);
        // Setup late bind buttons after login loads DOM
        setupOpenImportButton();
    } else {
        errorMsg.classList.remove("hidden");
        const card = document.querySelector(".login-card");
        card.style.animation = "shake 0.3s ease-in-out";
        setTimeout(() => card.style.animation = "", 300);
    }
});

// Login UI Quick Access & Password Toggle
const btnQuickAdmin = document.getElementById("btnQuickAdminCredentials");
if (btnQuickAdmin) {
    btnQuickAdmin.addEventListener("click", () => {
        document.getElementById("loginUser").value = "Admin";
        document.getElementById("loginPassword").value = "080125";
        showToast("Credenciais de Admin preenchidas!", "success");
    });
}

const btnTogglePass = document.getElementById("btnToggleLoginPass");
if (btnTogglePass) {
    btnTogglePass.addEventListener("click", () => {
        const passInput = document.getElementById("loginPassword");
        const isPass = passInput.type === "password";
        passInput.type = isPass ? "text" : "password";
        const icon = document.getElementById("iconTogglePass");
        if (icon) {
            icon.setAttribute("data-lucide", isPass ? "eye-off" : "eye");
            safeCreateIcons();
        }
    });
}

// Logout handler
document.getElementById("btnLogout").addEventListener("click", () => {
    sessionStorage.removeItem("nexus_crm_logged_in");
    sessionStorage.removeItem("nexus_crm_env");
    state.currentEnv = "";
    document.getElementById("loginOverlay").classList.remove("hidden");
    document.getElementById("appContainer").classList.add("hidden");
    document.getElementById("appContainer").classList.remove("logged-in");
    document.getElementById("loginForm").reset();
});

// Navigation & Tab Switching
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view-section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetView = item.getAttribute("data-view");
        localStorage.setItem("nexus_crm_active_view", targetView);
        
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        views.forEach(view => {
            if (view.id === `${targetView}View`) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        
        renderAll();
    });
});

// Link quick buttons
document.getElementById("btnViewAllContacts").addEventListener("click", () => {
    document.querySelector('[data-view="contacts"]').click();
});
document.getElementById("btnViewAllTasks").addEventListener("click", () => {
    document.querySelector('[data-view="tasks"]').click();
});

// Search input handler
const searchInput = document.getElementById("globalSearch");
searchInput.addEventListener("input", () => {
    const activeTab = document.querySelector(".nav-item.active").getAttribute("data-view");
    if (activeTab === "contacts") renderContacts();
    else if (activeTab === "kanban") renderKanban();
    else if (activeTab === "tasks") renderTasks();
    else if (activeTab === "dashboard") renderDashboard();
    else if (activeTab === "customers") renderCustomers();
    else if (activeTab === "products") renderProducts();
    else if (activeTab === "proposals") renderProposals();
    else if (activeTab === "contracts") renderContracts();
    else if (activeTab === "finance") renderFinance();
    else if (activeTab === "marketing") renderMarketingAssets();
});

// Modals Trigger Handlers
const btnQuickAdd = document.getElementById("btnQuickAddContact");
if (btnQuickAdd) btnQuickAdd.addEventListener("click", openAddContact);
const btnAddContact = document.getElementById("btnAddContact");
if (btnAddContact) btnAddContact.addEventListener("click", openAddContact);
document.getElementById("btnCloseContactModal").addEventListener("click", () => {
    document.getElementById("contactModal").classList.remove("active");
});
document.getElementById("btnCancelContactModal").addEventListener("click", () => {
    document.getElementById("contactModal").classList.remove("active");
});
document.getElementById("btnCloseDetailsModal").addEventListener("click", () => {
    document.getElementById("contactDetailsModal").classList.remove("active");
});

// Add Task Modal Toggle
document.getElementById("btnAddTask").addEventListener("click", () => {
    const hiddenIdInput = document.getElementById("taskId");
    if (hiddenIdInput) hiddenIdInput.value = "";
    const modalHeader = document.querySelector("#taskModal .modal-header h3");
    if (modalHeader) modalHeader.innerText = "Adicionar Nova Tarefa";
    document.getElementById("taskForm").reset();
    document.getElementById("taskModal").classList.add("active");
});
document.getElementById("btnCloseTaskModal").addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("active");
});
document.getElementById("btnCancelTaskModal").addEventListener("click", () => {
    document.getElementById("taskModal").classList.remove("active");
});

window.openEditTaskModal = function(id) {
    const env = getEnv();
    const task = env.tasks.find(t => t.id === id);
    if (!task) return;
    
    const hiddenIdInput = document.getElementById("taskId");
    if (hiddenIdInput) hiddenIdInput.value = task.id;
    
    const modalHeader = document.querySelector("#taskModal .modal-header h3");
    if (modalHeader) modalHeader.innerText = "Editar Tarefa";
    
    document.getElementById("taskTitle").value = task.title || "";
    document.getElementById("taskContact").value = task.contactId || "";
    document.getElementById("taskDueDate").value = task.dueDate || "";
    document.getElementById("taskPriority").value = task.priority || "medium";
    document.getElementById("taskAssignee").value = task.assignedTo || "Admin";
    
    document.getElementById("taskModal").classList.add("active");
};

// Contacts filter dropdown listener
const filterStatus = document.getElementById("filterStatus");
if (filterStatus) {
    filterStatus.addEventListener("change", () => {
        renderContacts();
    });
}

const filterTaskAssignee = document.getElementById("filterTaskAssignee");
if (filterTaskAssignee) {
    filterTaskAssignee.addEventListener("change", () => {
        renderTasks();
    });
}

// Task Filter Tabs Navigation
document.querySelectorAll(".tasks-filters li").forEach(tab => {
    tab.addEventListener("click", () => {
        window.taskActiveFilterOverride = null;
        document.querySelectorAll(".tasks-filters li").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderTasks();
    });
});

// Form Submission Handlers
// Contact Form
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("contactName").value;
    const company = document.getElementById("contactCompany").value;
    const email = document.getElementById("contactEmail").value;
    const phone = document.getElementById("contactPhone").value;
    const value = parseFloat(document.getElementById("contactValue").value) || 0;
    const status = document.getElementById("contactStatus").value;
    const niche = document.getElementById("contactNiche").value;
    const notes = document.getElementById("contactNotes").value;

    if (id) {
        const contact = env.contacts.find(c => c.id === id);
        if (contact) {
            const oldStatusText = translateStatus(contact.status);
            const newStatusText = translateStatus(status);
            
            contact.name = name;
            contact.company = company;
            contact.email = email;
            contact.phone = phone;
            contact.value = value;
            contact.niche = niche;
            
            if (contact.status !== status) {
                if (status === "won") {
                    document.getElementById("contactModal").classList.remove("active");
                    openConversionModal(contact.id);
                    return;
                } else {
                    contact.status = status;
                    contact.timeline.push({
                        id: "act_" + Date.now(),
                        type: "note",
                        description: `Funil atualizado de [${oldStatusText}] para [${newStatusText}]`,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            contact.notes = notes;
        }
    } else {
        const newContact = {
            id: "c_" + Date.now(),
            name,
            company,
            email,
            phone,
            value,
            status,
            niche,
            notes,
            createdAt: new Date().toISOString(),
            timeline: [
                { id: "act_" + Date.now(), type: "note", description: "Contato cadastrado no sistema.", timestamp: new Date().toISOString() }
            ]
        };
        env.contacts.push(newContact);
        
        if (status === "won") {
            saveState();
            document.getElementById("contactModal").classList.remove("active");
            openConversionModal(newContact.id);
            return;
        }
    }

    saveState();
    document.getElementById("contactModal").classList.remove("active");
    renderAll();
});

// Activity Form
document.getElementById("activityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const contactId = document.getElementById("activityContactId").value;
    const type = document.getElementById("activityType").value;
    const description = document.getElementById("activityDescription").value;

    const contact = env.contacts.find(c => c.id === contactId);
    if (contact) {
        contact.timeline.push({
            id: "act_" + Date.now(),
            type,
            description,
            timestamp: new Date().toISOString()
        });
        saveState();
        renderTimeline(contact);
        document.getElementById("activityForm").reset();
        renderAll();
    }
});

// Task Form
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const env = getEnv();
    const taskId = document.getElementById("taskId")?.value || "";
    const title = document.getElementById("taskTitle").value;
    const contactId = document.getElementById("taskContact").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;
    const assignedTo = document.getElementById("taskAssignee")?.value || "Admin";

    if (taskId) {
        // Edit existing task
        const task = env.tasks.find(t => t.id === taskId);
        if (task) {
            task.title = title;
            task.contactId = contactId;
            task.dueDate = dueDate;
            task.priority = priority;
            task.assignedTo = assignedTo;
            showToast("Tarefa atualizada!", "success");
        }
    } else {
        // Create new task
        const newTask = {
            id: "t_" + Date.now(),
            title,
            contactId,
            dueDate,
            priority,
            assignedTo,
            completed: false
        };
        env.tasks.push(newTask);
        showToast("Tarefa criada!", "success");
    }

    saveState();
    document.getElementById("taskModal").classList.remove("active");
    renderAll();
});

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    if (isDark) {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        themeToggleBtn.querySelector("span").innerText = "Modo Escuro";
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        themeToggleBtn.querySelector("span").innerText = "Modo Claro";
    }
    renderCharts();
});

// Toggle Privacy Mode Event Listener
const privacyBtn = document.getElementById("btnTogglePrivacy");
privacyBtn.addEventListener("click", () => {
    state.privacyMode = !state.privacyMode;
    updatePrivacyIcon();
    saveState();
    renderAll();
});

function updatePrivacyIcon() {
    const privacyBtn = document.getElementById("btnTogglePrivacy");
    if (privacyBtn) {
        if (state.privacyMode) {
            privacyBtn.innerHTML = `<i data-lucide="eye-off"></i>`;
        } else {
            privacyBtn.innerHTML = `<i data-lucide="eye"></i>`;
        }
        safeCreateIcons();
    }
}

// 8. Proposals Management Render & Builder
function renderProposals() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.proposals];

    if (searchVal) {
        filtered = filtered.filter(prop => {
            const contactName = prop.contactId ? (env.contacts.find(c => c.id === prop.contactId)?.name || "") : "";
            const productName = prop.productName || "";
            return contactName.toLowerCase().includes(searchVal) || productName.toLowerCase().includes(searchVal);
        });
    }

    const tbody = document.getElementById("proposalsTableBody");
    const emptyState = document.getElementById("proposalsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("proposalsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("proposalsTable").classList.remove("hidden");

        filtered.forEach(prop => {
            const contact = env.contacts.find(c => c.id === prop.contactId);
            const contactName = contact ? contact.name : "Nenhum";
            const companyName = contact && contact.company ? ` (${contact.company})` : "";
            const tr = document.createElement("tr");
            
            let statusText = "Pendente";
            let statusBadge = "warning";
            if (prop.status === "accepted") { statusText = "Aceita (Ganho)"; statusBadge = "positive"; }
            else if (prop.status === "declined") { statusText = "Recusada"; statusBadge = "inactive"; }

            tr.innerHTML = `
                <td><strong>${contactName}</strong><br><small style="color:var(--text-muted)">${companyName || "-"}</small></td>
                <td>${prop.productName}</td>
                <td><strong>${formatCurrency(prop.value)}</strong></td>
                <td>
                    <span class="badge-recurrence ${prop.recurrence}">
                        ${prop.recurrence === 'monthly' ? 'Mensal' : prop.recurrence === 'yearly' ? 'Anual' : 'Único'}
                    </span>
                </td>
                <td>${formatDate(prop.date)}</td>
                <td><span class="badge-status ${statusBadge}">${statusText}</span></td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-view-proposal" title="Visualizar / Editar"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-proposal" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-view-proposal").addEventListener("click", () => openViewProposal(prop.id));
            tr.querySelector(".btn-delete-proposal").addEventListener("click", () => deleteProposal(prop.id));

            tbody.appendChild(tr);
        });
    }
}

function openCreateProposal() {
    const env = getEnv();
    if (env.contacts.length === 0) {
        showToast("Cadastre pelo menos um lead para gerar propostas!", "warning");
        return;
    }

    document.getElementById("proposalConfigForm").reset();
    document.getElementById("proposalId").value = "";
    
    // Populate dropdowns
    populateProposalDropdowns();
    
    // Set default values
    if (env.products.length > 0) {
        document.getElementById("proposalProductSelect").value = env.products[0].id;
        document.getElementById("proposalFinalValue").value = env.products[0].price;
        document.getElementById("proposalRecurrence").value = env.products[0].type;
    } else {
        document.getElementById("proposalFinalValue").value = 1000;
        document.getElementById("proposalRecurrence").value = "single";
    }
    
    document.getElementById("proposalStatusSelect").value = "pending";
    
    // Show Builder, Hide List
    document.getElementById("proposalsListWrapper").classList.add("hidden");
    document.getElementById("proposalBuilderWrapper").classList.remove("hidden");
    
    // Trigger live preview update
    updateProposalPreview();
}

function openViewProposal(id) {
    const env = getEnv();
    const prop = env.proposals.find(p => p.id === id);
    if (!prop) return;

    // Populate dropdowns
    populateProposalDropdowns();

    // Load form values
    document.getElementById("proposalId").value = prop.id;
    document.getElementById("proposalContactSelect").value = prop.contactId;
    document.getElementById("proposalProductSelect").value = prop.productId || "";
    document.getElementById("proposalFinalValue").value = prop.value;
    document.getElementById("proposalRecurrence").value = prop.recurrence;
    document.getElementById("proposalStatusSelect").value = prop.status;

    // Restore checkbox addons state
    if (prop.addons && Array.isArray(prop.addons)) {
        document.querySelectorAll(".proposal-addon-checkbox").forEach(cb => {
            cb.checked = prop.addons.includes(cb.value);
        });
    }

    // Show Builder, Hide List
    document.getElementById("proposalsListWrapper").classList.add("hidden");
    document.getElementById("proposalBuilderWrapper").classList.remove("hidden");
    
    // Trigger live preview update
    updateProposalPreview();
}

function populateProposalDropdowns() {
    const env = getEnv();
    
    // Contacts select
    const cSelect = document.getElementById("proposalContactSelect");
    cSelect.innerHTML = "";
    env.contacts.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.innerText = `${c.name} (${c.company || "Sem Empresa"})`;
        cSelect.appendChild(opt);
    });

    // Products select - show all products
    const pSelect = document.getElementById("proposalProductSelect");
    pSelect.innerHTML = `<option value="custom">-- Serviço Customizado --</option>`;
    env.products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = p.name;
        pSelect.appendChild(opt);
    });

    const updateProposalAddons = () => {
        const selectedId = pSelect.value;
        const container = document.getElementById("proposalAddonsContainer");
        container.innerHTML = "";

        // Show all other products as potential addons
        const addonCandidates = env.products.filter(p => p.id !== selectedId);
        if (addonCandidates.length === 0) {
            container.innerHTML = `<span style="font-size:11px;color:var(--text-muted);">Nenhum serviço adicional disponível</span>`;
            return;
        }

        const coreProd = env.products.find(p => p.id === selectedId);
        const suggested = coreProd ? (coreProd.suggestedAddons || []) : [];

        addonCandidates.forEach(p => {
            const div = document.createElement("div");
            div.style = "display:flex; align-items:center; gap:8px; font-size:12px;";
            div.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; width:100%;">
                    <input type="checkbox" class="proposal-addon-checkbox" value="${p.id}">
                    <span style="flex:1;">${p.name}</span>
                    <strong style="color:var(--text-secondary);">${formatCurrency(p.price)}${p.type === 'monthly' ? '/mês' : ''}</strong>
                </label>
            `;
            const cb = div.querySelector("input");
            cb.checked = suggested.includes(p.id);
            cb.addEventListener("change", updateProposalPreview);
            container.appendChild(div);
        });
        updateProposalPreview();
    };

    pSelect.addEventListener("change", updateProposalAddons);
    
    // Also trigger preview updates when main selectors change
    cSelect.addEventListener("change", updateProposalPreview);
    document.getElementById("proposalFinalValue").addEventListener("input", updateProposalPreview);
    document.getElementById("proposalRecurrence").addEventListener("change", updateProposalPreview);

    updateProposalAddons();
}

function updateProposalPreview() {
    const env = getEnv();
    
    const propId = document.getElementById("proposalId").value || "PROP-" + Date.now().toString().substring(8);
    const contactId = document.getElementById("proposalContactSelect").value;
    const productId = document.getElementById("proposalProductSelect").value;
    const finalVal = parseFloat(document.getElementById("proposalFinalValue").value) || 0;
    const recurrence = document.getElementById("proposalRecurrence").value;

    const contact = env.contacts.find(c => c.id === contactId);
    let productName = "Serviço Customizado";
    let scopeList = [];

    if (productId !== "custom") {
        const prod = env.products.find(p => p.id === productId);
        if (prod) {
            productName = prod.name;
            scopeList = getScopeList(prod.id);
        }
    } else {
        scopeList = getScopeList("custom");
    }

    // Write to DOM elements in proposalPrintArea
    document.getElementById("previewProposalId").innerText = propId;
    document.getElementById("previewProposalDate").innerText = formatDate(new Date().toISOString());

    if (contact) {
        document.getElementById("previewClientName").innerText = contact.name;
        document.getElementById("previewClientDetails").innerText = `${contact.company || "Pessoa Física"} - ${contact.email}`;
        document.getElementById("previewSignatureClient").innerText = contact.name;
    } else {
        document.getElementById("previewClientName").innerText = "Cliente não selecionado";
        document.getElementById("previewClientDetails").innerText = "";
        document.getElementById("previewSignatureClient").innerText = "Contratante";
    }

    document.getElementById("previewProductName").innerText = productName;

    // Fill scope list in preview
    const scopeContainer = document.getElementById("previewProductScope");
    scopeContainer.innerHTML = "";
    const ul = document.createElement("ul");
    scopeList.forEach(s => {
        const li = document.createElement("li");
        li.innerText = s;
        ul.appendChild(li);
    });
    scopeContainer.appendChild(ul);

    // Format financial table recurrence & value
    const tableBody = document.getElementById("previewFinancialTableBody");
    if (tableBody) {
        tableBody.innerHTML = "";

        // Core row
        const coreTr = document.createElement("tr");
        const recText = recurrence === 'monthly' ? 'Mensalidade Recorrente' : recurrence === 'yearly' ? 'Anualidade Recorrente' : 'Taxa Única';
        coreTr.innerHTML = `
            <td><strong>${productName}</strong> <span style="font-size: 9px; color: var(--text-muted);">(Produto Principal)</span></td>
            <td>${recText}</td>
            <td><strong>${formatCurrency(finalVal)}</strong></td>
        `;
        tableBody.appendChild(coreTr);

        // Addons rows
        document.querySelectorAll(".proposal-addon-checkbox:checked").forEach(cb => {
            const prod = env.products.find(p => p.id === cb.value);
            if (prod) {
                const addTr = document.createElement("tr");
                const addRecText = prod.type === 'monthly' ? 'Mensalidade Recorrente' : prod.type === 'yearly' ? 'Anualidade Recorrente' : 'Taxa Única';
                addTr.innerHTML = `
                    <td><strong>${prod.name}</strong> <span style="font-size: 9px; color: var(--text-muted);">(Adicional/Conectado)</span></td>
                    <td>${addRecText}</td>
                    <td><strong>${formatCurrency(prod.price)}</strong></td>
                `;
                tableBody.appendChild(addTr);
            }
        });
    }
}

function saveProposal() {
    const env = getEnv();
    
    const id = document.getElementById("proposalId").value;
    const contactId = document.getElementById("proposalContactSelect").value;
    const productId = document.getElementById("proposalProductSelect").value;
    const finalVal = parseFloat(document.getElementById("proposalFinalValue").value) || 0;
    const recurrence = document.getElementById("proposalRecurrence").value;
    const status = document.getElementById("proposalStatusSelect").value;

    let productName = "Serviço Customizado";
    if (productId !== "custom") {
        const prod = env.products.find(p => p.id === productId);
        if (prod) productName = prod.name;
    }

    let savedProp = null;
    const checkedAddons = Array.from(document.querySelectorAll(".proposal-addon-checkbox:checked")).map(cb => cb.value);

    if (id) {
        // Edit existing proposal
        const prop = env.proposals.find(p => p.id === id);
        if (prop) {
            prop.contactId = contactId;
            prop.productId = productId;
            prop.productName = productName;
            prop.value = finalVal;
            prop.recurrence = recurrence;
            prop.status = status;
            prop.addons = checkedAddons;
            savedProp = prop;
        }
    } else {
        // Create new proposal
        const newProp = {
            id: "PROP-" + Date.now().toString().substring(8),
            contactId,
            productId,
            productName,
            value: finalVal,
            recurrence,
            status,
            addons: checkedAddons,
            date: new Date().toISOString()
        };
        env.proposals.push(newProp);
        savedProp = newProp;
    }

    // Integrated Contracts & Invoices generation if proposal is WON
    if (savedProp && savedProp.status === "accepted") {
        triggerProposalWonFlow(savedProp);
    }

    saveState();
    
    // Hide Builder, Show List
    document.getElementById("proposalBuilderWrapper").classList.add("hidden");
    document.getElementById("proposalsListWrapper").classList.remove("hidden");
    
    renderAll();
}

function triggerProposalWonFlow(proposal) {
    const env = getEnv();
    const contact = env.contacts.find(c => c.id === proposal.contactId);
    
    // 1. Create contract if not already exists
    const contractExists = env.contracts.some(con => con.proposalId === proposal.id);
    if (!contractExists) {
        const newCon = {
            id: "CONTR-" + Date.now().toString().substring(8),
            contactId: proposal.contactId,
            proposalId: proposal.id,
            clientName: contact ? contact.name : "Nenhum",
            company: contact ? (contact.company || "Pessoa Física") : "Pessoa Física",
            productName: proposal.productName,
            value: proposal.value,
            recurrence: proposal.recurrence,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "draft"
        };
        env.contracts.push(newCon);
    }

    // 2. Create invoice
    const invoiceExists = env.invoices.some(inv => inv.id === "FAT-" + proposal.id.substring(5));
    if (!invoiceExists) {
        const newInv = {
            id: "FAT-" + Date.now().toString().substring(8),
            customerName: contact ? contact.name : "Nenhum",
            company: contact ? (contact.company || "-") : "-",
            niche: contact ? (contact.niche || "Outro") : "Outro",
            productName: proposal.productName,
            value: proposal.value,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending"
        };
        env.invoices.push(newInv);
    }

    // 3. Create active customer
    const customerExists = env.customers.some(cust => cust.contactId === proposal.contactId && cust.productName === proposal.productName);
    if (!customerExists) {
        const newCust = {
            id: "cust_" + Date.now(),
            contactId: proposal.contactId,
            name: contact ? contact.name : "Nenhum",
            company: contact ? (contact.company || "-") : "-",
            niche: contact ? (contact.niche || "Outro") : "Outro",
            productName: proposal.productName,
            value: proposal.value,
            type: proposal.recurrence,
            status: "active",
            createdAt: new Date().toISOString()
        };
        env.customers.push(newCust);
    }
}

function deleteProposal(id) {
    if (confirm("Tem certeza que deseja excluir esta proposta comercial?")) {
        const env = getEnv();
        env.proposals = env.proposals.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

// 9. Contracts Management
function renderContracts() {
    const env = getEnv();
    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.contracts];

    if (searchVal) {
        filtered = filtered.filter(con => 
            con.clientName.toLowerCase().includes(searchVal) || 
            con.productName.toLowerCase().includes(searchVal) ||
            con.company.toLowerCase().includes(searchVal)
        );
    }

    const tbody = document.getElementById("contractsTableBody");
    const emptyState = document.getElementById("contractsEmptyState");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("contractsTable").classList.add("hidden");
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("contractsTable").classList.remove("hidden");

        filtered.forEach(con => {
            const tr = document.createElement("tr");
            
            let statusText = "Rascunho";
            let statusBadge = "warning";
            if (con.status === "active") { statusText = "Ativo"; statusBadge = "active"; }
            else if (con.status === "expired") { statusText = "Encerrado"; statusBadge = "inactive"; }

            tr.innerHTML = `
                <td><strong>${con.clientName}</strong><br><small style="color:var(--text-muted)">${con.company}</small></td>
                <td>${con.productName}</td>
                <td><strong>${formatCurrency(con.value)}</strong> <small style="color:var(--text-muted)">(${con.recurrence === 'monthly' ? 'Mensal' : con.recurrence === 'yearly' ? 'Anual' : 'Único'})</small></td>
                <td>${formatDate(con.startDate)}</td>
                <td>${formatDate(con.endDate)}</td>
                <td><span class="badge-status ${statusBadge}">${statusText}</span></td>
                <td>
                    <div class="kanban-card-actions">
                        <button class="btn-icon-only btn-view-contract" title="Visualizar Contrato"><i data-lucide="file-text" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-edit-contract" title="Editar Contrato" style="color:var(--color-primary);"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-contract" title="Excluir"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>
            `;

            tr.querySelector(".btn-view-contract").addEventListener("click", () => openViewContract(con.id));
            tr.querySelector(".btn-edit-contract").onclick = () => openContractEditModal(con.id);
            tr.querySelector(".btn-delete-contract").addEventListener("click", () => deleteContract(con.id));

            // Make cells clickable to edit (excluding the actions td)
            const cells = tr.querySelectorAll('td');
            for (let i = 0; i < cells.length - 1; i++) {
                cells[i].style.cursor = 'pointer';
                cells[i].onclick = () => openContractEditModal(con.id);
            }

            tbody.appendChild(tr);
        });
        safeCreateIcons();
    }
}

function openViewContract(id) {
    const env = getEnv();
    const con = env.contracts.find(c => c.id === id);
    if (!con) return;

    const contact = env.contacts.find(c => c.id === con.contactId);

    // Populate A4 Contract Print Area
    document.getElementById("cPreviewId").innerText = con.id;
    document.getElementById("cPreviewClientName").innerText = con.clientName;
    document.getElementById("cPreviewClientEmail").innerText = contact ? contact.email : "Não cadastrado";
    document.getElementById("cPreviewClientCompany").innerText = con.company;
    document.getElementById("cPreviewProductName").innerText = con.productName;
    document.getElementById("cPreviewValue").innerText = formatCurrency(con.value);
    document.getElementById("cPreviewRecurrence").innerText = con.recurrence === 'monthly' ? 'Mensal recorrente' : con.recurrence === 'yearly' ? 'Anual recorrente' : 'Taxa Única';
    document.getElementById("cPreviewStartDate").innerText = formatDate(con.startDate);
    document.getElementById("cPreviewEndDate").innerText = formatDate(con.endDate);
    document.getElementById("cPreviewSignatureClient").innerText = con.clientName;

    // Wire Edit button in viewer
    const editBtn = document.getElementById("btnEditContractFromViewer");
    if (editBtn) {
        editBtn.onclick = () => openContractEditModal(con.id);
    }

    // Show/hide activate button based on status
    const actBtn = document.getElementById("btnActivateContract");
    if (con.status === "draft") {
        actBtn.classList.remove("hidden");
        actBtn.onclick = () => {
            con.status = "active";
            saveState();
            renderAll();
            showToast("Contrato ativado comercialmente com sucesso!", "success");
            document.getElementById("contractViewerWrapper").classList.add("hidden");
            document.getElementById("contractsListWrapper").classList.remove("hidden");
        };
    } else {
        actBtn.classList.add("hidden");
    }

    // Toggle panels
    document.getElementById("contractsListWrapper").classList.add("hidden");
    document.getElementById("contractViewerWrapper").classList.remove("hidden");
}

function openContractEditModal(id) {
    const env = getEnv();
    const con = env.contracts.find(c => c.id === id);
    if (!con) return;

    document.getElementById("contractEditId").value = con.id;
    document.getElementById("contractEditClientName").value = con.clientName || "";
    document.getElementById("contractEditCompany").value = con.company || "";
    document.getElementById("contractEditProductName").value = con.productName || "";
    document.getElementById("contractEditValue").value = con.value || 0;
    document.getElementById("contractEditRecurrence").value = con.recurrence || "monthly";
    document.getElementById("contractEditStatus").value = con.status || "active";
    document.getElementById("contractEditStartDate").value = con.startDate || "";
    document.getElementById("contractEditEndDate").value = con.endDate || "";

    document.getElementById("contractEditModal").classList.add("active");
}

// Contract edit modal event listeners
const btnCloseContractEditModal = document.getElementById("btnCloseContractEditModal");
if (btnCloseContractEditModal) btnCloseContractEditModal.onclick = () => document.getElementById("contractEditModal").classList.remove("active");

const btnCancelContractEditModal = document.getElementById("btnCancelContractEditModal");
if (btnCancelContractEditModal) btnCancelContractEditModal.onclick = () => document.getElementById("contractEditModal").classList.remove("active");

const contractEditModal = document.getElementById("contractEditModal");
if (contractEditModal) {
    contractEditModal.onclick = (e) => { if (e.target === contractEditModal) contractEditModal.classList.remove("active"); };
}

const contractEditForm = document.getElementById("contractEditForm");
if (contractEditForm) {
    contractEditForm.onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const id = document.getElementById("contractEditId").value;
        const con = env.contracts.find(c => c.id === id);
        if (con) {
            con.clientName = document.getElementById("contractEditClientName").value.trim();
            con.company = document.getElementById("contractEditCompany").value.trim();
            con.productName = document.getElementById("contractEditProductName").value.trim();
            con.value = parseFloat(document.getElementById("contractEditValue").value) || 0;
            con.recurrence = document.getElementById("contractEditRecurrence").value;
            con.status = document.getElementById("contractEditStatus").value;
            con.startDate = document.getElementById("contractEditStartDate").value;
            con.endDate = document.getElementById("contractEditEndDate").value;

            saveState();
            document.getElementById("contractEditModal").classList.remove("active");
            renderContracts();
            if (!document.getElementById("contractViewerWrapper").classList.contains("hidden")) {
                openViewContract(con.id);
            }
            showToast("Contrato atualizado com sucesso!", "success");
        }
    };
}

function deleteContract(id) {
    if (confirm("Deseja realmente remover este contrato?")) {
        const env = getEnv();
        env.contracts = env.contracts.filter(c => c.id !== id);
        saveState();
        renderAll();
    }
}

// 10. Calendar/Agenda Management
function renderCalendar() {
    const env = getEnv();
    const grid = document.getElementById("calendarGridBody");
    if (!grid) return;
    grid.innerHTML = "";

    const currDate = state.calendarDate;
    const year = currDate.getFullYear();
    const month = currDate.getMonth();

    // Set month title
    const monthsLocale = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.getElementById("calendarCurrentMonthText").innerText = `${monthsLocale[month]} ${year}`;

    // Get first day of the month
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalDaysPrev = new Date(year, month, 0).getDate();

    // Render cells of previous month (offset offset)
    for (let x = firstDayIndex; x > 0; x--) {
        const prevDay = totalDaysPrev - x + 1;
        const cell = document.createElement("div");
        cell.className = "calendar-day-cell inactive-month";
        cell.innerHTML = `<span class="calendar-day-number">${prevDay}</span>`;
        grid.appendChild(cell);
    }

    // Render current month days
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day-cell";
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if today
        if (year === 2026 && month === 6 && day === 12) { // Default mock environment anchor date
            cell.classList.add("today");
        }

        cell.innerHTML = `
            <span class="calendar-day-number">${day}</span>
            <div class="calendar-events-container" id="events-${dateString}"></div>
        `;

        grid.appendChild(cell);

        // Single click opens day preview modal
        cell.addEventListener("click", () => {
            openDayPreview(dateString);
        });
    }

    // Populate events, tasks, and contracts into calendar cells
    // Events
    env.events.forEach(evt => {
        const container = document.getElementById(`events-${evt.date}`);
        if (container) {
            const badge = document.createElement("span");
            badge.className = "calendar-event-badge meeting";
            badge.innerText = `🤝 ${evt.time} ${evt.title.substring(0, 10)}${evt.title.length > 10 ? '...' : ''}`;
            badge.title = evt.title;
            container.appendChild(badge);
        }
    });

    // Tasks
    env.tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
            const container = document.getElementById(`events-${task.dueDate}`);
            if (container) {
                const badge = document.createElement("span");
                badge.className = "calendar-event-badge task";
                badge.innerText = `📝 ${task.title.substring(0, 12)}${task.title.length > 12 ? '...' : ''}`;
                badge.title = task.title;
                container.appendChild(badge);
            }
        }
    });

    // Contracts
    env.contracts.forEach(con => {
        if (con.startDate) {
            const container = document.getElementById(`events-${con.startDate}`);
            if (container) {
                const badge = document.createElement("span");
                badge.className = "calendar-event-badge contract";
                badge.innerText = `💼 ${con.clientName.substring(0, 12)}${con.clientName.length > 12 ? '...' : ''}`;
                badge.title = con.clientName;
                container.appendChild(badge);
            }
        }
    });
}

function openDayPreview(dateString) {
    const env = getEnv();
    
    // Parse date for visual title
    const d = new Date(dateString + "T00:00:00");
    const formattedDateText = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    document.getElementById("dayPreviewDateText").innerText = formattedDateText;
    
    // Set target date for Quick Add Event from preview
    const quickAddBtn = document.getElementById("btnQuickAddEventFromPreview");
    quickAddBtn.onclick = () => {
        document.getElementById("dayPreviewModal").classList.remove("active");
        document.getElementById("eventForm").reset();
        document.getElementById("eventDate").value = dateString;
        document.getElementById("eventModal").classList.add("active");
    };

    const container = document.getElementById("dayPreviewContent");
    container.innerHTML = "";

    // Find all items on this date
    const dailyEvents = env.events.filter(e => e.date === dateString);
    const dailyTasks = env.tasks.filter(t => t.dueDate === dateString && !t.completed);
    const dailyContracts = env.contracts.filter(c => c.startDate === dateString);

    if (dailyEvents.length === 0 && dailyTasks.length === 0 && dailyContracts.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
                <i data-lucide="calendar" style="width:36px; height:36px; opacity:0.5; margin-bottom:8px; display:inline-block;"></i>
                <p style="font-size:12px; margin:0;">Nenhum compromisso agendado para este dia.</p>
            </div>
        `;
        safeCreateIcons();
        document.getElementById("dayPreviewModal").classList.add("active");
        return;
    }

    // Render Meetings Group
    if (dailyEvents.length > 0) {
        const group = document.createElement("div");
        group.innerHTML = `<h4 style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">🤝 Reuniões & Compromissos</h4>`;
        dailyEvents.forEach(evt => {
            const item = document.createElement("div");
            item.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; margin-bottom:6px;";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="font-size:12px; color:var(--text-primary);">${evt.title}</strong>
                    <span style="font-size:11px; font-weight:600; color:var(--color-teal);">${evt.time}</span>
                </div>
                <p style="font-size:11px; color:var(--text-secondary); margin:0 0 4px 0;">${evt.description || "Sem notas descritivas."}</p>
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <button class="btn btn-secondary btn-xs btn-del-event" style="padding:2px 6px; font-size:8px; color:var(--color-danger); border-color:var(--color-danger-glow);">Excluir</button>
                </div>
            `;
            item.querySelector(".btn-del-event").onclick = () => {
                if (confirm("Remover este compromisso da agenda?")) {
                    env.events = env.events.filter(e => e.id !== evt.id);
                    saveState();
                    renderAll();
                    openDayPreview(dateString); // reload preview
                }
            };
            group.appendChild(item);
        });
        container.appendChild(group);
    }

    // Render Tasks Group
    if (dailyTasks.length > 0) {
        const group = document.createElement("div");
        group.innerHTML = `<h4 style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">📝 Tarefas Comerciais</h4>`;
        dailyTasks.forEach(task => {
            const item = document.createElement("div");
            item.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; margin-bottom:6px;";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="font-size:12px; color:var(--text-primary);">${task.title}</strong>
                    <span class="task-priority-badge ${task.priority}" style="font-size:8px; padding:1px 4px; border-radius:2px;">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:6px; margin-top:6px;">
                    <button class="btn btn-primary btn-xs btn-check-task" style="padding:2px 6px; font-size:8px;">Concluir</button>
                </div>
            `;
            item.querySelector(".btn-check-task").onclick = () => {
                task.completed = true;
                saveState();
                renderAll();
                openDayPreview(dateString); // reload preview
            };
            group.appendChild(item);
        });
        container.appendChild(group);
    }

    // Render Contracts Group
    if (dailyContracts.length > 0) {
        const group = document.createElement("div");
        group.innerHTML = `<h4 style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">💼 Início de Contratos</h4>`;
        dailyContracts.forEach(con => {
            const item = document.createElement("div");
            item.style = "background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; margin-bottom:6px;";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="font-size:12px; color:var(--text-primary);">${con.clientName} (${con.company})</strong>
                    <span style="font-size:10px; font-weight:600; color:var(--color-success);">${formatCurrency(con.value)}</span>
                </div>
                <p style="font-size:11px; color:var(--text-secondary); margin:0 0 4px 0;">Serviço: ${con.productName} (${con.recurrence === 'monthly' ? 'Mensal' : 'Único'})</p>
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <button class="btn btn-secondary btn-xs btn-view-con" style="padding:2px 6px; font-size:8px;">Ver Contrato</button>
                </div>
            `;
            item.querySelector(".btn-view-con").onclick = () => {
                document.getElementById("dayPreviewModal").classList.remove("active");
                document.querySelector('[data-view="contracts"]').click();
                openViewContract(con.id);
            };
            group.appendChild(item);
        });
        container.appendChild(group);
    }

    document.getElementById("dayPreviewModal").classList.add("active");
    safeCreateIcons();
}

// 11. Finance View Control
function renderFinance() {
    const env = getEnv();
    const today = new Date().toISOString().split('T')[0];
    
    // Auto-mark overdue
    env.invoices.forEach(inv => {
        if (inv.status === 'pending' && inv.dueDate && inv.dueDate < today) {
            inv.status = 'overdue';
        }
    });
    
    const selectSubTab = (activeId, activePanelId) => {
        const tabs   = ['tabInvoices','tabExpenses','tabServices','tabByClient','tabOverdue','tabFiscalNotes'];
        const panels = ['panelInvoices','panelExpenses','panelServices','panelByClient','panelOverdue','panelFiscalNotes'];
        tabs.forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('active', id === activeId); });
        panels.forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', id !== activePanelId); });
    };

    const tabInvoices = document.getElementById('tabInvoices');
    const tabExpenses = document.getElementById('tabExpenses');
    const tabServices = document.getElementById('tabServices');
    const tabByClient = document.getElementById('tabByClient');
    const tabOverdue  = document.getElementById('tabOverdue');
    const tabFN       = document.getElementById('tabFiscalNotes');
    if (tabInvoices) tabInvoices.onclick = () => selectSubTab('tabInvoices', 'panelInvoices');
    if (tabExpenses) tabExpenses.onclick = () => selectSubTab('tabExpenses', 'panelExpenses');
    if (tabServices) tabServices.onclick = () => { selectSubTab('tabServices', 'panelServices'); renderServices(); };
    if (tabByClient) tabByClient.onclick = () => { selectSubTab('tabByClient', 'panelByClient'); renderByClient(env); };
    if (tabOverdue)  tabOverdue.onclick  = () => { selectSubTab('tabOverdue',  'panelOverdue');  renderOverdue(env); };
    if (tabFN)       tabFN.onclick       = () => selectSubTab('tabFiscalNotes', 'panelFiscalNotes');

    // Wire KPI card clicks to quickly view filtered revenues or expenses
    const cardKpiPaid = document.getElementById('cardKpiPaid');
    if (cardKpiPaid) cardKpiPaid.onclick = () => { selectSubTab('tabInvoices', 'panelInvoices'); finInvoiceStatus = 'paid'; renderFinance(); };

    const cardKpiPending = document.getElementById('cardKpiPending');
    if (cardKpiPending) cardKpiPending.onclick = () => { selectSubTab('tabInvoices', 'panelInvoices'); finInvoiceStatus = 'pending'; renderFinance(); };

    const cardKpiOverdue = document.getElementById('cardKpiOverdue');
    if (cardKpiOverdue) cardKpiOverdue.onclick = () => { selectSubTab('tabInvoices', 'panelInvoices'); finInvoiceStatus = 'overdue'; renderFinance(); };

    const cardKpiExpenses = document.getElementById('cardKpiExpenses');
    if (cardKpiExpenses) cardKpiExpenses.onclick = () => { selectSubTab('tabExpenses', 'panelExpenses'); };

    // Wire Toggle Charts Button
    const btnToggleCharts = document.getElementById('btnToggleFinCharts');
    const chartsRow = document.getElementById('finChartsRow');
    if (btnToggleCharts && chartsRow) {
        btnToggleCharts.onclick = () => {
            showFinCharts = !showFinCharts;
            renderFinance();
        };
        if (showFinCharts) {
            chartsRow.style.display = 'grid';
            btnToggleCharts.innerHTML = `<i data-lucide="eye-off" style="width:14px;height:14px;"></i><span>Ocultar Gráficos</span>`;
        } else {
            chartsRow.style.display = 'none';
            btnToggleCharts.innerHTML = `<i data-lucide="eye" style="width:14px;height:14px;"></i><span>Mostrar Gráficos</span>`;
        }
    }

    // Wire 'Novo Serviço' button
    const btnAddService = document.getElementById('btnAddService');
    if (btnAddService) btnAddService.onclick = () => openServiceModal();

    // Wire period filter group in Finance
    const finFilterGroup = document.getElementById('finPeriodFilterGroup');
    if (finFilterGroup) {
        finFilterGroup.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === finPeriod);
            btn.onclick = () => { finPeriod = btn.dataset.period; renderFinance(); };
        });
    }

    // Wire invoice status filter group
    const invStatusGroup = document.getElementById('invoiceStatusFilterGroup');
    if (invStatusGroup) {
        invStatusGroup.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.status === finInvoiceStatus);
            btn.onclick = () => { finInvoiceStatus = btn.dataset.status; renderFinance(); };
        });
    }

    // Wire invoice search input
    const invSearchInput = document.getElementById('invoiceSearchInput');
    if (invSearchInput) {
        invSearchInput.oninput = (e) => {
            finInvoiceSearch = e.target.value.toLowerCase().trim();
            renderFinance();
        };
    }

    const range = getFinPeriodRange();

    // Filter invoices & expenses by period
    const filteredInvoices = (finPeriod === 'all')
        ? env.invoices
        : env.invoices.filter(inv => {
            const d = inv.dueDate || '';
            return d >= range.start && d <= range.end;
        });

    const filteredExpenses = (finPeriod === 'all')
        ? env.expenses
        : env.expenses.filter(exp => {
            const d = exp.date || '';
            return d >= range.start && d <= range.end;
        });

    // Calculate Profitability Metrics for period (dados reais)
    const totalPaid     = filteredInvoices.filter(inv => inv.status === 'paid').reduce((s, i) => s + (i.value||0), 0);
    const totalPending  = filteredInvoices.filter(inv => ['pending','pending_delivery'].includes(inv.status)).reduce((s, i) => s + (i.value||0), 0);
    const totalOverdue  = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((s, i) => s + (i.value||0), 0);

    // Compute Direct Product/Service Costs (COGS: Domínio, Hospedagem, Licenças)
    let totalDirectProductCosts = 0;
    filteredInvoices.filter(inv => inv.status === 'paid').forEach(inv => {
        const prod = env.products.find(p => p.name === inv.productName) || defaultProducts.find(p => p.name === inv.productName);
        if (prod && prod.cost) {
            totalDirectProductCosts += prod.cost;
        }
    });

    const totalExpenses = (filteredExpenses||[]).reduce((s, e) => s + (e.value||0), 0) + (monthlyServiceCost * serviceMultiplier) + totalDirectProductCosts;
    const netProfit     = totalPaid - totalExpenses;
    const margin        = totalPaid > 0 ? Math.round((netProfit / totalPaid) * 100) : 0;

    // Update DOM KPIs
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('finKpiTotalRevenue',  formatCurrency(totalPaid));
    setEl('finKpiTotalExpenses', formatCurrency(totalExpenses));
    setEl('finKpiNetProfit',     formatCurrency(netProfit));
    setEl('finKpiMargin',        `${margin}%`);

    const pendingBadgeEl = document.getElementById('finKpiPending');
    if (pendingBadgeEl) pendingBadgeEl.innerText = formatCurrency(totalPending);
    const overdueBadgeEl = document.getElementById('finKpiOverdue');
    if (overdueBadgeEl) overdueBadgeEl.innerText = formatCurrency(totalOverdue);

    const marginBadge = document.getElementById('finKpiMarginBadge');
    if (marginBadge) {
        marginBadge.innerText  = margin >= 50 ? 'Excelente' : margin >= 20 ? 'Saudável' : 'Atenção Margem';
        marginBadge.className  = margin >= 20 ? 'kpi-badge positive' : 'kpi-badge warning';
    }

    // Filter invoices for display in table (Status & Search)
    let displayInvoices = [...filteredInvoices];
    if (finInvoiceStatus !== 'all') {
        if (finInvoiceStatus === 'pending') {
            displayInvoices = displayInvoices.filter(i => ['pending', 'pending_delivery'].includes(i.status));
        } else {
            displayInvoices = displayInvoices.filter(i => i.status === finInvoiceStatus);
        }
    }
    if (finInvoiceSearch) {
        displayInvoices = displayInvoices.filter(i =>
            (i.id || '').toLowerCase().includes(finInvoiceSearch) ||
            (i.customerName || '').toLowerCase().includes(finInvoiceSearch) ||
            (i.company || '').toLowerCase().includes(finInvoiceSearch) ||
            (i.productName || '').toLowerCase().includes(finInvoiceSearch)
        );
    }

    // Render Invoices Table
    const invoicesTbody = document.getElementById("invoicesTableBody");
    invoicesTbody.innerHTML = "";
    if (displayInvoices.length === 0) {
        invoicesTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:24px;">Nenhuma receita/fatura encontrada para este filtro.</td></tr>`;
    } else {
        displayInvoices.forEach(inv => {
            const tr = document.createElement("tr");
            let statusText = 'Pendente'; let statusClass = 'pending_partial';
            if (inv.status === 'paid')             { statusText = 'Recebido';    statusClass = 'active'; }
            else if (inv.status === 'overdue')     { statusText = 'Vencida';     statusClass = 'overdue'; }
            else if (inv.status === 'pending_delivery') { statusText = 'Na Entrega'; statusClass = 'pending_delivery'; }

            tr.innerHTML = `
                <td><strong>${inv.id}</strong></td>
                <td><strong>${inv.customerName || '-'}</strong><br><small style="color:var(--text-muted)">${inv.company || ''}</small></td>
                <td><strong>${inv.productName || 'Serviço'}</strong><br><small style="color:var(--text-muted); font-size:10px;">${inv.niche || '-'}</small></td>
                <td>${formatDate(inv.dueDate)}</td>
                <td style="color:var(--color-primary); font-weight:700;">${formatCurrency(inv.value)}</td>
                <td><span class="badge-status ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="kanban-card-actions">
                        ${inv.status !== 'paid' ? `<button class="btn-icon-only btn-pay-invoice" title="Confirmar Recebimento" style="color:var(--color-success);"><i data-lucide="check" style="width:14px;height:14px;"></i></button>` : ''}
                        <button class="btn-icon-only btn-edit-invoice" title="Editar" style="color:var(--color-primary);"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                        <button class="btn-icon-only btn-delete-invoice" title="Remover" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                    </div>
                </td>`;

            if (inv.status !== 'paid') {
                tr.querySelector('.btn-pay-invoice').onclick = () => {
                    inv.status = 'paid';
                    saveState();
                    renderFinance();
                    renderDashboard();
                    showToast('✅ Recebimento confirmado! Saldo atualizado.', 'success');
                };
            }
            const editFn = () => {
                const newVal = prompt('Editar valor da fatura (R$):', inv.value);
                if (newVal === null) return;
                const newDate = prompt('Editar data de vencimento (AAAA-MM-DD):', inv.dueDate || '');
                if (newDate === null) return;
                inv.value = parseFloat(newVal) || inv.value;
                inv.dueDate = newDate || inv.dueDate;
                saveState();
                renderFinance();
                renderDashboard();
                showToast('Fatura atualizada!', 'success');
            };
            tr.querySelector('.btn-edit-invoice').onclick = editFn;

            // Make cells clickable to edit (excluding the actions td)
            const cells = tr.querySelectorAll('td');
            for (let i = 0; i < cells.length - 1; i++) {
                cells[i].style.cursor = 'pointer';
                cells[i].onclick = editFn;
            }

            tr.querySelector('.btn-delete-invoice').onclick = () => {
                if (confirm('Remover esta fatura?')) {
                    env.invoices = env.invoices.filter(i => i.id !== inv.id);
                    saveState();
                    renderFinance();
                    renderDashboard();
                }
            };
            invoicesTbody.appendChild(tr);
        });
    }

    // Summary footer
    const countInfo = document.getElementById('invoicesCountInfo');
    if (countInfo) countInfo.innerText = `Exibindo ${displayInvoices.length} de ${filteredInvoices.length} receitas no período`;
    const totalVal = displayInvoices.reduce((s, i) => s + (i.value || 0), 0);
    const sumEl = document.getElementById('invoicesTotalVal');
    if (sumEl) sumEl.innerText = formatCurrency(totalVal);

    // Render Expenses Table
    const expensesTbody = document.getElementById("expensesTableBody");
    expensesTbody.innerHTML = "";
    if (filteredExpenses.length === 0) {
        expensesTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:24px;">Nenhuma despesa registrada para este período.</td></tr>`;
    } else {
        filteredExpenses.forEach(exp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${exp.description}</strong></td>
            <td>${getCategoryBadgeHtml(exp.category)}</td>
            <td>${exp.supplier||'-'}</td>
            <td>${getRecurrenceBadgeHtml(exp.recurrence)}</td>
            <td>${formatDate(exp.date)}</td>
            <td style="color:var(--color-danger);font-weight:700;">- ${formatCurrency(exp.value)}</td>
            <td>
                <div class="kanban-card-actions">
                    <button class="btn-icon-only btn-edit-expense" title="Editar" style="color:var(--color-primary);"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-expense" title="Remover" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>`;

        const editExpFn = () => {
            const newDesc = prompt('Descrição da despesa:', exp.description);
            if (newDesc === null) return;
            const newVal = prompt('Valor (R$):', exp.value);
            if (newVal === null) return;
            exp.description = newDesc || exp.description;
            exp.value = parseFloat(newVal) || exp.value;
            saveState();
            renderFinance();
            renderDashboard();
            showToast('Despesa atualizada!', 'success');
        };

        tr.querySelector(".btn-edit-expense").onclick = editExpFn;

        // Make cells clickable to edit (excluding the actions td)
        const cells = tr.querySelectorAll('td');
        for (let i = 0; i < cells.length - 1; i++) {
            cells[i].style.cursor = 'pointer';
            cells[i].onclick = editExpFn;
        }

        tr.querySelector(".btn-delete-expense").onclick = () => {
            if (confirm("Deseja realmente excluir este custo operacional?")) {
                env.expenses = env.expenses.filter(e => e.id !== exp.id);
                saveState();
                renderFinance();
                renderDashboard();
            }
        };

        expensesTbody.appendChild(tr);
    });
    }

    renderFiscalNotes();
    renderFinanceCharts(env, filteredInvoices);
    safeCreateIcons();
}

function renderFinanceCharts(env, activeInvoices) {
    if (cashFlowChart) cashFlowChart.destroy();
    if (revenueByNicheChart) revenueByNicheChart.destroy();

    const chartsRow = document.getElementById('finChartsRow');
    if (chartsRow && chartsRow.style.display === 'none') {
        return;
    }

    const invList = activeInvoices || env.invoices;

    const isDark = document.body.classList.contains('dark-theme');
    const chartLabelColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#2a2a40' : '#e5e7eb';

    // 1. Recurrent vs Pontual calculations
    const recurrentRevenue = invList
        .filter(inv => {
            const prod = defaultProducts.find(p => p.name === inv.productName);
            return prod ? prod.type === "monthly" : false;
        })
        .reduce((sum, inv) => sum + inv.value, 0);

    const singleRevenue = invList
        .filter(inv => {
            const prod = defaultProducts.find(p => p.name === inv.productName);
            return prod ? prod.type !== "monthly" : true;
        })
        .reduce((sum, inv) => sum + inv.value, 0);

    const ctxCash = document.getElementById("cashFlowChart").getContext("2d");
    cashFlowChart = new Chart(ctxCash, {
        type: 'bar',
        data: {
            labels: ['Recorrente (SaaS/Avença)', 'Pontual (Taxas/Projetos)'],
            datasets: [{
                data: [recurrentRevenue, singleRevenue],
                backgroundColor: ['rgba(13, 148, 136, 0.75)', 'rgba(0, 140, 255, 0.75)'],
                borderColor: ['#0d9488', '#008cff'],
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: chartLabelColor } },
                y: { grid: { color: gridColor }, ticks: { color: chartLabelColor, callback: (v) => formatCurrency(v) } }
            }
        }
    });

    // 2. Revenue by Niche calculations
    const niches = ["Negócio Local", "E-commerce", "Infoproduto / Lançamentos", "SaaS / Startup", "Serviços B2B", "Turismo", "Outro"];
    const nicheSums = niches.map(n => {
        return env.invoices
            .filter(inv => inv.niche === n)
            .reduce((sum, inv) => sum + inv.value, 0);
    });

    const ctxNiche = document.getElementById("revenueByNicheChart").getContext("2d");
    revenueByNicheChart = new Chart(ctxNiche, {
        type: 'doughnut',
        data: {
            labels: niches,
            datasets: [{
                data: nicheSums,
                backgroundColor: [
                    'rgba(0, 140, 255, 0.75)',
                    'rgba(13, 148, 136, 0.75)',
                    'rgba(245, 158, 11, 0.75)',
                    'rgba(154, 52, 18, 0.75)',
                    'rgba(107, 114, 128, 0.75)',
                    'rgba(71, 85, 105, 0.75)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: chartLabelColor, font: { size: 9 } }
                }
            }
        }
    });
}

// 12. Marketing Assets & Channels Management
let activeMarketingFilter = "all";

function renderMarketingAssets() {
    const env = getEnv();
    const grid = document.getElementById("marketingAssetsGrid");
    const emptyState = document.getElementById("marketingEmptyState");
    if (!grid) return;
    grid.innerHTML = "";

    const searchVal = document.getElementById("globalSearch").value.toLowerCase();
    
    let filtered = [...env.marketingAssets];

    // Category Filter
    if (activeMarketingFilter !== "all") {
        filtered = filtered.filter(asset => asset.category === activeMarketingFilter);
    }

    // Search query Filter
    if (searchVal) {
        filtered = filtered.filter(asset => 
            asset.title.toLowerCase().includes(searchVal) ||
            (asset.metrics && asset.metrics.toLowerCase().includes(searchVal)) ||
            (asset.notes && asset.notes.toLowerCase().includes(searchVal))
        );
    }

    // Setup categories tab class
    document.querySelectorAll("#marketingFilters li").forEach(li => {
        if (li.getAttribute("data-marketing-filter") === activeMarketingFilter) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    });

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");

        filtered.forEach(asset => {
            const card = document.createElement("div");
            card.className = "marketing-card";

            // Category Details
            let iconName = "globe";
            let categoryName = "Sites & LPs";
            let categoryClass = "sites";

            if (asset.category === "ads") {
                iconName = "megaphone";
                categoryName = "Anúncios";
                categoryClass = "ads";
            } else if (asset.category === "organic") {
                iconName = "search";
                categoryName = "SEO / Orgânico";
                categoryClass = "organic";
            } else if (asset.category === "social") {
                iconName = "instagram";
                categoryName = "Social & Blog";
                categoryClass = "social";
            }

            // Status Details
            let statusText = "Ativo";
            let statusClass = "active";
            if (asset.status === "planning") {
                statusText = "Em Planejamento";
                statusClass = "warning";
            } else if (asset.status === "paused") {
                statusText = "Pausado";
                statusClass = "inactive";
            }

            let iconHtml = `<i data-lucide="${iconName}" style="width: 14px; height: 14px;"></i>`;
            if (iconName === "instagram") {
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram" style="width: 14px; height: 14px; stroke-width: 2.2px;"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
            }

            card.innerHTML = `
                <div class="marketing-card-header">
                    <div class="marketing-card-icon-title">
                        <div class="marketing-card-icon-wrapper ${categoryClass}">
                            ${iconHtml}
                        </div>
                        <div style="display:flex; flex-direction:column;">
                            <span class="marketing-card-title">${asset.title}</span>
                            <span style="font-size:9px; color:var(--text-muted);">${categoryName}</span>
                        </div>
                    </div>
                    <span class="badge-status ${statusClass}" style="padding: 2px 6px; font-size: 8px;">${statusText}</span>
                </div>
                <div class="marketing-card-body">
                    ${asset.url ? `<a href="${asset.url}" target="_blank" class="marketing-card-link"><i data-lucide="external-link" style="width:10px; height:10px;"></i> ${asset.url.replace(/^https?:\/\//, '')}</a>` : '<span style="color:var(--text-muted); font-style:italic;">Sem link cadastrado</span>'}
                    
                    <div class="marketing-card-metrics" style="margin-top:4px;">
                        <span style="font-size:9px; color:var(--text-muted); display:block; margin-bottom:2px;">Métricas de Desempenho</span>
                        <span style="font-size:11px;">${asset.metrics || "Sem métricas registradas"}</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="marketing-card-cost">Custo: <strong>${asset.cost || "Grátis"}</strong></span>
                    </div>

                    ${asset.notes ? `<p class="marketing-card-notes">${asset.notes}</p>` : ""}
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border-color); padding-top:10px; margin-top:4px;">
                    <button class="btn btn-secondary btn-xs btn-edit-asset" style="padding: 2px 6px; font-size: 9px;"><i data-lucide="edit-2" style="width:10px; height:10px; margin-right:2px;"></i> Editar</button>
                    <button class="btn btn-secondary btn-xs btn-delete-asset" style="padding: 2px 6px; font-size: 9px; color:var(--color-danger); border-color:var(--color-danger-glow);"><i data-lucide="trash-2" style="width:10px; height:10px; margin-right:2px;"></i> Excluir</button>
                </div>
            `;

            card.querySelector(".btn-edit-asset").onclick = () => openEditMarketingAsset(asset.id);
            card.querySelector(".btn-delete-asset").onclick = () => deleteMarketingAsset(asset.id);

            grid.appendChild(card);
        });
    }
    safeCreateIcons();
}

function openEditMarketingAsset(id) {
    const env = getEnv();
    const asset = env.marketingAssets.find(x => x.id === id);
    if (!asset) return;

    document.getElementById("marketingAssetId").value = asset.id;
    document.getElementById("marketingAssetTitle").value = asset.title;
    document.getElementById("marketingAssetCategory").value = asset.category;
    document.getElementById("marketingAssetStatus").value = asset.status;
    document.getElementById("marketingAssetUrl").value = asset.url || "";
    document.getElementById("marketingAssetMetrics").value = asset.metrics || "";
    document.getElementById("marketingAssetCost").value = asset.cost || "";
    document.getElementById("marketingAssetNotes").value = asset.notes || "";

    document.getElementById("marketingAssetModalTitle").innerText = "Editar Ativo de Marketing";
    document.getElementById("marketingAssetModal").classList.add("active");
}

function deleteMarketingAsset(id) {
    if (confirm("Deseja realmente remover este ativo de marketing?")) {
        const env = getEnv();
        env.marketingAssets = env.marketingAssets.filter(x => x.id !== id);
        saveState();
        renderAll();
    }
}

// Boot Setup
window.addEventListener("DOMContentLoaded", () => {
    init();
    
    // Mobile Sidebar controls
    const btnToggleSidebar = document.getElementById("btnToggleMobileSidebar");
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    
    if (btnToggleSidebar && sidebar && backdrop) {
        const openSidebar = () => {
            sidebar.classList.add("sidebar-open");
            backdrop.classList.remove("hidden");
        };
        const closeSidebar = () => {
            sidebar.classList.remove("sidebar-open");
            backdrop.classList.add("hidden");
        };
        
        btnToggleSidebar.addEventListener("click", openSidebar);
        backdrop.addEventListener("click", closeSidebar);
        
        // Auto-close on nav clicks
        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", closeSidebar);
        });
    }
    
    // Bind buttons early in case of active session reload
    if (sessionStorage.getItem("nexus_crm_logged_in") === "true") {
        setupOpenImportButton();
    }
    
    // Bind proposals actions
    document.getElementById("btnCreateProposal").addEventListener("click", openCreateProposal);
    document.getElementById("btnBackToProposalsList").addEventListener("click", () => {
        document.getElementById("proposalBuilderWrapper").classList.add("hidden");
        document.getElementById("proposalsListWrapper").classList.remove("hidden");
    });
    document.getElementById("btnPrintProposal").addEventListener("click", () => {
        window.print();
    });
    document.getElementById("btnSaveProposal").addEventListener("click", saveProposal);
    
    // Form change listeners to feed live preview
    document.getElementById("proposalContactSelect").addEventListener("change", updateProposalPreview);
    document.getElementById("proposalProductSelect").addEventListener("change", (e) => {
        const env = getEnv();
        const prod = env.products.find(p => p.id === e.target.value);
        if (prod) {
            document.getElementById("proposalFinalValue").value = prod.price;
            document.getElementById("proposalRecurrence").value = prod.type;
        }
        updateProposalPreview();
    });
    document.getElementById("proposalFinalValue").addEventListener("input", updateProposalPreview);
    document.getElementById("proposalRecurrence").addEventListener("change", updateProposalPreview);

    // Bind Contracts Actions
    document.getElementById("btnBackToContractsList").onclick = () => {
        document.getElementById("contractViewerWrapper").classList.add("hidden");
        document.getElementById("contractsListWrapper").classList.remove("hidden");
    };
    document.getElementById("btnPrintContract").onclick = () => {
        window.print();
    };

    // Bind Calendar Navigation
    document.getElementById("btnPrevMonth").onclick = () => {
        const d = state.calendarDate;
        state.calendarDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        renderCalendar();
    };
    document.getElementById("btnNextMonth").onclick = () => {
        const d = state.calendarDate;
        state.calendarDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        renderCalendar();
    };

    // Calendar Modal trigger & Save
    document.getElementById("btnCreateEvent").onclick = () => {
        document.getElementById("eventForm").reset();
        document.getElementById("eventDate").value = new Date().toISOString().split("T")[0];
        document.getElementById("eventModal").classList.add("active");
    };
    document.getElementById("btnCloseEventModal").onclick = () => {
        document.getElementById("eventModal").classList.remove("active");
    };
    document.getElementById("btnCancelEventModal").onclick = () => {
        document.getElementById("eventModal").classList.remove("active");
    };

    document.getElementById("eventForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const title = document.getElementById("eventTitle").value;
        const contactId = document.getElementById("eventContact").value;
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        const description = document.getElementById("eventDescription").value;

        const newEvt = {
            id: "evt_" + Date.now(),
            title,
            contactId,
            date,
            time,
            description
        };
        env.events.push(newEvt);
        saveState();
        renderAll();
        document.getElementById("eventModal").classList.remove("active");
    };

    // Finance Modals Triggers
    document.getElementById("btnCreateInvoice").onclick = () => {
        document.getElementById("invoiceForm").reset();
        document.getElementById("invoiceDueDate").value = new Date().toISOString().split("T")[0];
        document.getElementById("invoiceModal").classList.add("active");
    };
    document.getElementById("btnCloseInvoiceModal").onclick = () => {
        document.getElementById("invoiceModal").classList.remove("active");
    };
    document.getElementById("btnCancelInvoiceModal").onclick = () => {
        document.getElementById("invoiceModal").classList.remove("active");
    };

    document.getElementById("invoiceForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const customerName = document.getElementById("invoiceCustomer").value;
        const company = document.getElementById("invoiceCompany").value || "-";
        const niche = document.getElementById("invoiceNiche").value;
        const productName = document.getElementById("invoiceProduct").value;
        const value = parseFloat(document.getElementById("invoiceValue").value) || 0;
        const dueDate = document.getElementById("invoiceDueDate").value;

        const newInv = {
            id: "FAT-" + Date.now().toString().substring(8),
            customerName,
            company,
            niche,
            productName,
            value,
            dueDate,
            status: "pending"
        };
        env.invoices.push(newInv);
        saveState();
        renderAll();
        document.getElementById("invoiceModal").classList.remove("active");
    };

    const btnCreateFiscalNote = document.getElementById("btnCreateFiscalNote");
    if (btnCreateFiscalNote) {
        btnCreateFiscalNote.onclick = () => {
            openAddFiscalNote();
        };
    }
    const btnCloseFiscalNoteModal = document.getElementById("btnCloseFiscalNoteModal");
    if (btnCloseFiscalNoteModal) {
        btnCloseFiscalNoteModal.onclick = () => {
            document.getElementById("fiscalNoteModal").classList.remove("active");
        };
    }
    const btnCancelFiscalNoteModal = document.getElementById("btnCancelFiscalNoteModal");
    if (btnCancelFiscalNoteModal) {
        btnCancelFiscalNoteModal.onclick = () => {
            document.getElementById("fiscalNoteModal").classList.remove("active");
        };
    }

    const fiscalNoteForm = document.getElementById("fiscalNoteForm");
    if (fiscalNoteForm) {
        fiscalNoteForm.onsubmit = (e) => {
            e.preventDefault();
            const env = getEnv();
            const id = document.getElementById("fiscalNoteId").value;
            const number = document.getElementById("fiscalNoteNumber").value;
            const issueDate = document.getElementById("fiscalNoteIssueDate").value;
            const clientName = document.getElementById("fiscalNoteClient").value;
            const productName = document.getElementById("fiscalNoteProduct").value;
            const value = parseFloat(document.getElementById("fiscalNoteValue").value) || 0;
            const generateReceipt = document.getElementById("fiscalNoteGenerateReceipt")?.checked;
            
            let receiptId = null;
            
            if (id) {
                const nf = env.fiscalNotes.find(x => x.id === id);
                if (nf) {
                    nf.number = number;
                    nf.issueDate = issueDate;
                    nf.clientName = clientName;
                    nf.productName = productName;
                    nf.value = value;
                }
            } else {
                if (generateReceipt) {
                    const newInvoice = {
                        id: "FAT-" + Date.now().toString().substring(8),
                        customerName: clientName,
                        company: "-",
                        niche: "Outro",
                        productName: productName + ` (Ref: NF ${number})`,
                        value: value,
                        dueDate: issueDate,
                        status: "paid"
                    };
                    env.invoices.push(newInvoice);
                    receiptId = newInvoice.id;
                }
                
                const newNf = {
                    id: "nf_" + Date.now(),
                    number,
                    clientName,
                    productName,
                    value,
                    issueDate,
                    receiptId
                };
                env.fiscalNotes.push(newNf);
            }
            
            saveState();
            renderAll();
            document.getElementById("fiscalNoteModal").classList.remove("active");
        };
    }

    document.getElementById("btnCreateExpense").onclick = () => {
        document.getElementById("expenseForm").reset();
        document.getElementById("expenseDate").value = new Date().toISOString().split("T")[0];
        document.getElementById("expenseModal").classList.add("active");
    };
    document.getElementById("btnCloseExpenseModal").onclick = () => {
        document.getElementById("expenseModal").classList.remove("active");
    };
    document.getElementById("btnCancelExpenseModal").onclick = () => {
        document.getElementById("expenseModal").classList.remove("active");
    };

    document.getElementById("expenseForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const description = document.getElementById("expenseDescription").value;
        const category = document.getElementById("expenseCategory").value;
        const supplier = document.getElementById("expenseSupplier")?.value || "";
        const recurrence = document.getElementById("expenseRecurrence")?.value || "single";
        const value = parseFloat(document.getElementById("expenseValue").value) || 0;
        const date = document.getElementById("expenseDate").value;

        const newExp = {
            id: "exp_" + Date.now(),
            description,
            category,
            supplier,
            recurrence,
            value,
            date
        };
        env.expenses.push(newExp);
        saveState();
        renderAll();
        document.getElementById("expenseModal").classList.remove("active");
    };

    // Marketing Assets Modals Binds
    document.getElementById("btnCreateMarketingAsset").onclick = () => {
        document.getElementById("marketingAssetForm").reset();
        document.getElementById("marketingAssetId").value = "";
        document.getElementById("marketingAssetModalTitle").innerText = "Adicionar Ativo de Marketing";
        document.getElementById("marketingAssetModal").classList.add("active");
    };
    document.getElementById("btnCloseMarketingAssetModal").onclick = () => {
        document.getElementById("marketingAssetModal").classList.remove("active");
    };
    document.getElementById("btnCancelMarketingAssetModal").onclick = () => {
        document.getElementById("marketingAssetModal").classList.remove("active");
    };

    document.getElementById("marketingAssetForm").onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const id = document.getElementById("marketingAssetId").value;
        const title = document.getElementById("marketingAssetTitle").value;
        const category = document.getElementById("marketingAssetCategory").value;
        const status = document.getElementById("marketingAssetStatus").value;
        const url = document.getElementById("marketingAssetUrl").value;
        const metrics = document.getElementById("marketingAssetMetrics").value;
        const cost = document.getElementById("marketingAssetCost").value;
        const notes = document.getElementById("marketingAssetNotes").value;

        if (id) {
            const asset = env.marketingAssets.find(x => x.id === id);
            if (asset) {
                asset.title = title;
                asset.category = category;
                asset.status = status;
                asset.url = url;
                asset.metrics = metrics;
                asset.cost = cost;
                asset.notes = notes;
            }
        } else {
            const newAsset = {
                id: "ma_" + Date.now(),
                title,
                category,
                status,
                url,
                metrics,
                cost,
                notes
            };
            env.marketingAssets.push(newAsset);
        }

        saveState();
        renderAll();
        document.getElementById("marketingAssetModal").classList.remove("active");
    };

    // Category Filter Navigation Binds
    document.querySelectorAll("#marketingFilters li").forEach(tab => {
        tab.onclick = () => {
            activeMarketingFilter = tab.getAttribute("data-marketing-filter");
            renderMarketingAssets();
        };
    });

    // Calendar Day Preview Modal Binds
    document.getElementById("btnCloseDayPreviewModal").onclick = () => {
        document.getElementById("dayPreviewModal").classList.remove("active");
    };
    document.getElementById("btnCloseDayPreviewOk").onclick = () => {
        document.getElementById("dayPreviewModal").classList.remove("active");
    };

    // Pipeline Funnel Filter Binds
    const kfn = document.getElementById("kanbanFilterNiche");
    if (kfn) kfn.onchange = renderKanban;
    const kfp = document.getElementById("kanbanFilterPeriod");
    if (kfp) kfp.onchange = renderKanban;

    // View Mode Switchers
    const btnKanban = document.getElementById("btnPipelineModeKanban");
    if (btnKanban) {
        btnKanban.onclick = () => {
            state.pipelineViewMode = "kanban";
            renderKanban();
        };
    }
    const btnFunnel = document.getElementById("btnPipelineModeFunnel");
    if (btnFunnel) {
        btnFunnel.onclick = () => {
            state.pipelineViewMode = "funnel";
            renderKanban();
        };
    }

    // Funnel Stage Clicks
    const stgTop = document.getElementById("funnelStageTop");
    if (stgTop) {
        stgTop.onclick = () => {
            state.activeFunnelSegment = "top";
            renderKanban();
        };
    }
    const stgMid = document.getElementById("funnelStageMid");
    if (stgMid) {
        stgMid.onclick = () => {
            state.activeFunnelSegment = "mid";
            renderKanban();
        };
    }
    const stgBottom = document.getElementById("funnelStageBottom");
    if (stgBottom) {
        stgBottom.onclick = () => {
            state.activeFunnelSegment = "bottom";
            renderKanban();
        };
    }

    // Backup actions logic
    const btnExportBackup = document.getElementById("btnExportBackup");
    if (btnExportBackup) {
        btnExportBackup.onclick = () => {
            const dataStr = localStorage.getItem("nexus_crm_multitenant_state") || JSON.stringify(state);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = 'crm_backup_' + new Date().toISOString().split('T')[0] + '.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        };
    }

    const btnImportBackup = document.getElementById("btnImportBackup");
    const backupFileInput = document.getElementById("backupFileInput");
    if (btnImportBackup && backupFileInput) {
        btnImportBackup.onclick = () => {
            backupFileInput.click();
        };
        backupFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    if (parsed.environments || parsed.currentEnv) {
                        localStorage.setItem("nexus_crm_multitenant_state", evt.target.result);
                        showToast("Backup importado com sucesso! A página será recarregada.", "success");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        showToast("Arquivo de backup inválido.", "error");
                    }
                } catch (err) {
                    showToast("Erro ao ler o arquivo de backup.", "error");
                }
            };
            reader.readAsText(file);
        };
    }
    
    // Import History triggers
    const btnOpenImportHistory = document.getElementById("btnOpenImportHistory");
    if (btnOpenImportHistory) {
        btnOpenImportHistory.addEventListener("click", () => {
            renderImportHistory();
            document.getElementById("importHistoryModal").classList.add("active");
        });
    }
    const btnCloseImportHistoryModal = document.getElementById("btnCloseImportHistoryModal");
    if (btnCloseImportHistoryModal) {
        btnCloseImportHistoryModal.addEventListener("click", () => {
            document.getElementById("importHistoryModal").classList.remove("active");
        });
    }
    const btnCancelImportHistoryModal = document.getElementById("btnCancelImportHistoryModal");
    if (btnCancelImportHistoryModal) {
        btnCancelImportHistoryModal.addEventListener("click", () => {
            document.getElementById("importHistoryModal").classList.remove("active");
        });
    }
    
    // Bind Customers actions (Manual Create, Edit, and Services Modal)
    const btnCreateCustomer = document.getElementById("btnCreateCustomer");
    if (btnCreateCustomer) {
        btnCreateCustomer.addEventListener("click", () => {
            openAddCustomer();
        });
    }
    const btnCloseCustomerModal = document.getElementById("btnCloseCustomerModal");
    if (btnCloseCustomerModal) {
        btnCloseCustomerModal.addEventListener("click", () => {
            document.getElementById("customerModal").classList.remove("active");
        });
    }
    const btnCancelCustomerModal = document.getElementById("btnCancelCustomerModal");
    if (btnCancelCustomerModal) {
        btnCancelCustomerModal.addEventListener("click", () => {
            document.getElementById("customerModal").classList.remove("active");
        });
    }

    // === NEW FEATURE MODALS ===

    // Manage Niches Modal
    const btnManageNiches = document.getElementById('btnManageNiches');
    if (btnManageNiches) {
        btnManageNiches.addEventListener('click', () => {
            renderNichesList();
            // Populate add niche select in customer form
            const env = getEnv();
            const nicheSelect = document.getElementById('customerNiche');
            if (nicheSelect) {
                nicheSelect.innerHTML = (env.niches || []).map(n => `<option value="${n}">${n}</option>`).join('') + '<option value="custom">+ Personalizado</option>';
            }
            document.getElementById('manageNichesModal').classList.add('active');
        });
    }
    const btnCloseNichesModal = document.getElementById('btnCloseNichesModal');
    if (btnCloseNichesModal) btnCloseNichesModal.addEventListener('click', () => document.getElementById('manageNichesModal').classList.remove('active'));
    const btnCloseNichesModalFooter = document.getElementById('btnCloseNichesModalFooter');
    if (btnCloseNichesModalFooter) btnCloseNichesModalFooter.addEventListener('click', () => document.getElementById('manageNichesModal').classList.remove('active'));

    const btnAddNiche = document.getElementById('btnAddNiche');
    if (btnAddNiche) {
        btnAddNiche.addEventListener('click', () => {
            const input = document.getElementById('newNicheInput');
            const val = input.value.trim();
            if (!val) return;
            const env = getEnv();
            if (!env.niches.includes(val)) {
                env.niches.push(val);
                saveState();
                renderNichesList();
                // Update dropdown in customer form
                const nicheSelect = document.getElementById('customerNiche');
                if (nicheSelect) {
                    nicheSelect.innerHTML = env.niches.map(n => `<option value="${n}">${n}</option>`).join('') + '<option value="custom">+ Personalizado</option>';
                }
            }
            input.value = '';
        });
    }

    // Adjust Balance Modal
    const btnAdjustBalance = document.getElementById('btnAdjustBalance');
    if (btnAdjustBalance) {
        btnAdjustBalance.addEventListener('click', () => {
            const env = getEnv();
            document.getElementById('balanceAdjustInput').value = env.balanceAdjustment || 0;
            document.getElementById('adjustBalanceModal').classList.add('active');
        });
    }
    const btnCloseAdjustBalance = document.getElementById('btnCloseAdjustBalanceModal');
    if (btnCloseAdjustBalance) btnCloseAdjustBalance.addEventListener('click', () => document.getElementById('adjustBalanceModal').classList.remove('active'));
    const btnCancelAdjustBalance = document.getElementById('btnCancelAdjustBalance');
    if (btnCancelAdjustBalance) btnCancelAdjustBalance.addEventListener('click', () => document.getElementById('adjustBalanceModal').classList.remove('active'));
    
    const btnSaveAdjust = document.getElementById('btnSaveAdjustBalance');
    if (btnSaveAdjust) {
        btnSaveAdjust.addEventListener('click', () => {
            const env = getEnv();
            const val = parseFloat(document.getElementById('balanceAdjustInput').value) || 0;
            env.balanceAdjustment = val;
            saveState();
            document.getElementById('adjustBalanceModal').classList.remove('active');
            renderDashboard();
            showToast('Saldo ajustado com sucesso!', 'success');
        });
    }

    // Zerar mês atual
    const btnZeroMonth = document.getElementById('btnZeroMonth');
    if (btnZeroMonth) {
        btnZeroMonth.addEventListener('click', () => {
            if (!confirm('Isso irá arquivar todas as faturas pagas deste mês e zerar o ajuste de saldo. Deseja continuar?')) return;
            const env = getEnv();
            const now = new Date();
            const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            // Archive paid invoices from this month
            env.invoices.forEach(inv => {
                if (inv.status === 'paid' && inv.dueDate && inv.dueDate.startsWith(monthStr)) {
                    inv.status = 'archived';
                }
            });
            env.balanceAdjustment = 0;
            saveState();
            document.getElementById('adjustBalanceModal').classList.remove('active');
            renderDashboard();
            renderFinance();
            showToast('✅ Mês zerado! Faturas pagas arquivadas.', 'success');
        });
    }

    // Edit Customer Modal
    const btnCloseEditCustomer = document.getElementById('btnCloseEditCustomerModal');
    if (btnCloseEditCustomer) btnCloseEditCustomer.addEventListener('click', () => document.getElementById('editCustomerModal').classList.remove('active'));
    const btnCancelEditCustomer = document.getElementById('btnCancelEditCustomer');
    if (btnCancelEditCustomer) btnCancelEditCustomer.addEventListener('click', () => document.getElementById('editCustomerModal').classList.remove('active'));

    const editCustomerFormEl = document.getElementById('editCustomerForm');
    if (editCustomerFormEl) {
        editCustomerFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const env = getEnv();
            const key = document.getElementById('editCustomerKey').value;
            const newCompany = document.getElementById('editCustomerCompany').value.trim();
            const newNiche = document.getElementById('editCustomerNiche').value;
            const newStatus = document.getElementById('editCustomerStatus').value;
            
            // Update all customers with matching company/name key
            env.customers.forEach(cust => {
                const custKey = String(cust.company || cust.name || '').trim();
                if (custKey === key) {
                    if (newCompany) cust.company = newCompany;
                    cust.niche = newNiche;
                    cust.status = newStatus;
                }
            });
            
            saveState();
            document.getElementById('editCustomerModal').classList.remove('active');
            renderCustomers();
            showToast('Cliente atualizado com sucesso!', 'success');
        });
    }

    // Dashboard Customization Modal controls
    const btnOpenDashCustom = document.getElementById("btnOpenDashboardCustomizationModal");
    if (btnOpenDashCustom) {
        btnOpenDashCustom.addEventListener("click", () => {
            const modal = document.getElementById("dashboardCustomizationModal");
            if (modal) {
                applyDashboardCustomization();
                modal.classList.add("active");
            }
        });
    }

    const btnCloseDashCustom = document.getElementById("btnCloseDashboardCustomizationModal");
    if (btnCloseDashCustom) {
        btnCloseDashCustom.addEventListener("click", () => {
            document.getElementById("dashboardCustomizationModal").classList.remove("active");
        });
    }

    const btnCancelDashCustom = document.getElementById("btnCancelDashboardCustomizationModal");
    if (btnCancelDashCustom) {
        btnCancelDashCustom.addEventListener("click", () => {
            document.getElementById("dashboardCustomizationModal").classList.remove("active");
        });
    }

    const btnSaveDashCustom = document.getElementById("btnSaveDashboardCustomization");
    if (btnSaveDashCustom) {
        btnSaveDashCustom.addEventListener("click", () => {
            const chkKpis = document.getElementById("chkShowKpiGrid");
            const chkFinancial = document.getElementById("chkShowFinancialChart");
            const chkFunnel = document.getElementById("chkShowFunnelChart");
            const chkRecent = document.getElementById("chkShowRecentLeads");
            const chkUrgent = document.getElementById("chkShowUrgentTasks");
            
            const settings = {
                showKpis: chkKpis ? chkKpis.checked : true,
                showFinancialChart: chkFinancial ? chkFinancial.checked : true,
                showFunnelChart: chkFunnel ? chkFunnel.checked : true,
                showRecentLeads: chkRecent ? chkRecent.checked : true,
                showUrgentTasks: chkUrgent ? chkUrgent.checked : true
            };
            
            localStorage.setItem("nexus_crm_dashboard_widgets", JSON.stringify(settings));
            applyDashboardCustomization();
            
            document.getElementById("dashboardCustomizationModal").classList.remove("active");
            showToast("Configuração do Dashboard salva com sucesso!", "success");
        });
    }

    // Customer Product Selection change listener
    const customerProductSelect = document.getElementById("customerProduct");
    if (customerProductSelect) {
        customerProductSelect.addEventListener("change", (e) => {
            const val = e.target.value;
            const customContainer = document.getElementById("customerProductNameCustomContainer");
            const customInput = document.getElementById("customerProductNameCustom");
            const priceInput = document.getElementById("customerPrice");
            const billingInput = document.getElementById("customerBillingType");
            
            if (val === "custom") {
                if (customContainer) customContainer.style.display = "block";
                if (customInput) {
                    customInput.required = true;
                    customInput.value = "";
                }
                if (priceInput) priceInput.value = "";
                if (billingInput) billingInput.value = "single";
            } else {
                if (customContainer) customContainer.style.display = "none";
                if (customInput) {
                    customInput.required = false;
                    customInput.value = "";
                }
                const env = getEnv();
                const prod = env.products.find(p => p.id === val);
                if (prod) {
                    if (priceInput) priceInput.value = prod.price;
                    if (billingInput) billingInput.value = prod.type;
                }
            }
        });
    }

    const btnCloseServicesModal = document.getElementById("btnCloseServicesModal");
    if (btnCloseServicesModal) {
        btnCloseServicesModal.addEventListener("click", () => {
            document.getElementById("clientServicesModal").classList.remove("active");
        });
    }
    const btnCancelServicesModal = document.getElementById("btnCancelServicesModal");
    if (btnCancelServicesModal) {
        btnCancelServicesModal.addEventListener("click", () => {
            document.getElementById("clientServicesModal").classList.remove("active");
        });
    }
    const btnAddServiceFromDetails = document.getElementById("btnAddServiceFromDetails");
    if (btnAddServiceFromDetails) {
        btnAddServiceFromDetails.addEventListener("click", () => {
            document.getElementById("clientServicesModal").classList.remove("active");
            const env = getEnv();
            const services = env.customers.filter(c => String(c.company || c.name || "").trim() === currentDetailsClientKey);
            if (services.length > 0) {
                openAddCustomer({
                    contactId: services[0].contactId,
                    name: services[0].name,
                    company: services[0].company,
                    niche: services[0].niche
                });
            } else {
                openAddCustomer();
            }
        });
    }



    const contactsTrigger = document.getElementById("customerContactsTrigger");
    const contactsDropdown = document.getElementById("customerContactsDropdown");
    if (contactsTrigger && contactsDropdown) {
        contactsTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            contactsDropdown.classList.toggle("hidden");
        });
        document.addEventListener("click", () => {
            contactsDropdown.classList.add("hidden");
        });
    }

    // Calendar Notifications triggers
    const btnNotifications = document.getElementById("btnNotifications");
    if (btnNotifications) {
        btnNotifications.addEventListener("click", () => {
            updateCalendarNotifications();
            document.getElementById("notificationsModal").classList.add("active");
        });
    }
    const btnCloseNotificationsModal = document.getElementById("btnCloseNotificationsModal");
    if (btnCloseNotificationsModal) {
        btnCloseNotificationsModal.addEventListener("click", () => {
            document.getElementById("notificationsModal").classList.remove("active");
        });
    }
    const btnCancelNotificationsModal = document.getElementById("btnCancelNotificationsModal");
    if (btnCancelNotificationsModal) {
        btnCancelNotificationsModal.addEventListener("click", () => {
            document.getElementById("notificationsModal").classList.remove("active");
        });
    }

    const customerFormElement = document.getElementById("customerForm");
    if (customerFormElement) {
        customerFormElement.addEventListener("submit", (e) => {
            e.preventDefault();
            const env = getEnv();
            const id = document.getElementById("customerId").value;
            
            // Get selected contact IDs from multiselect checkboxes
            const dropdown = document.getElementById("customerContactsDropdown");
            const contactIds = dropdown ? Array.from(dropdown.querySelectorAll("input[type='checkbox']:checked")).map(chk => chk.value) : [];
            const contactId = contactIds.length > 0 ? contactIds[0] : null;

            const name = document.getElementById("customerName").value;
            const company = document.getElementById("customerCompany").value;
            const niche = document.getElementById("customerNiche").value;
            
            const startDate = document.getElementById("customerStartDate")?.value || "";
            const endDate = document.getElementById("customerEndDate")?.value || "";
            const lastServiceDate = document.getElementById("customerLastServiceDate")?.value || "";
            const documentUrl = document.getElementById("customerDocumentUrl")?.value || "";

            const status = document.getElementById("customerStatus").value;

            const productIdVal = document.getElementById("customerProduct").value;
            let productName = "Serviço Customizado";
            let productIds = [];
            
            if (productIdVal === "custom") {
                productName = document.getElementById("customerProductNameCustom").value || "Serviço Customizado";
            } else {
                const prod = env.products.find(x => x.id === productIdVal);
                if (prod) {
                    productName = prod.name;
                    productIds = [productIdVal];
                }
            }
            
            const price = parseFloat(document.getElementById("customerPrice").value) || 0;
            const billingType = document.getElementById("customerBillingType").value;
            const paymentOption = document.getElementById("customerPaymentOption")?.value || 'full';
            const paymentDueDate = document.getElementById("customerPaymentDueDate")?.value || "";
            const paymentDueDate2 = document.getElementById("customerPaymentDueDate2")?.value || "";
            const countBalance = document.getElementById("customerCountBalance")?.checked !== false;

            // Determine final status based on payment option
            let finalStatus = document.getElementById("customerStatus").value;
            if (paymentOption === 'partial') {
                finalStatus = 'pending_partial';
            }

            if (id) {
                const cust = env.customers.find(c => c.id === id);
                if (cust) {
                    cust.contactIds = contactIds;
                    cust.contactId = contactId || null;
                    cust.name = name;
                    cust.company = company;
                    cust.niche = niche;
                    cust.productIds = [...productIds];
                    cust.productName = productName;
                    cust.value = price;
                    cust.type = billingType;
                    cust.status = finalStatus;
                    cust.paymentTerm = paymentOption;
                    cust.paymentDueDate = paymentDueDate;
                    cust.paymentDueDate2 = paymentDueDate2;
                    cust.countBalance = countBalance;
                    cust.startDate = startDate;
                    cust.endDate = endDate;
                    cust.lastServiceDate = lastServiceDate;
                    cust.documentUrl = documentUrl;
                }
            } else {
                const newCust = {
                    id: "cust_" + Date.now(),
                    contactIds: contactIds,
                    contactId: contactId || null,
                    name: name,
                    company: company,
                    niche: niche,
                    productIds: [...productIds],
                    productName: productName,
                    value: price,
                    type: billingType,
                    status: finalStatus,
                    paymentTerm: paymentOption,
                    paymentDueDate: paymentDueDate,
                    paymentDueDate2: paymentDueDate2,
                    countBalance: countBalance,
                    startDate: startDate,
                    endDate: endDate,
                    lastServiceDate: lastServiceDate,
                    documentUrl: documentUrl,
                    createdAt: new Date().toISOString()
                };
                env.customers.push(newCust);

                // Auto-generate invoice with correct due date
                const invoiceDueDate = paymentDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
                const invoiceValue = paymentOption === 'partial' ? price * 0.5 : price;

                const newInvoice = {
                    id: "FAT-" + Date.now().toString().substring(8),
                    customerName: name,
                    company: company || "-",
                    niche: niche,
                    productName: productName,
                    value: invoiceValue,
                    dueDate: invoiceDueDate,
                    status: "pending"
                };
                env.invoices.push(newInvoice);

                // If 50% condition — generate second invoice for remainder (on delivery)
                if (paymentOption === 'partial') {
                    const secondInvoice = {
                        id: "FAT-D" + Date.now().toString().substring(8),
                        customerName: name,
                        company: company || "-",
                        niche: niche,
                        productName: productName + " (2ª Parcela — Na Entrega)",
                        value: price * 0.5,
                        dueDate: paymentDueDate2 || "",
                        status: "pending_delivery"
                    };
                    env.invoices.push(secondInvoice);
                }

                // Auto-generate contract draft
                const newCon = {
                    id: "CONTR-" + Date.now().toString().substring(8),
                    contactId: contactId || null,
                    proposalId: "DIRECT-CONV-" + Date.now().toString().substring(8),
                    clientName: name,
                    company: company || "Pessoa Física",
                    productName: productName,
                    value: price,
                    recurrence: billingType,
                    startDate: startDate || new Date().toISOString().split("T")[0],
                    endDate: endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    status: "draft"
                };
                env.contracts.push(newCon);

                // Mark all linked contacts as won
                contactIds.forEach(cid => {
                    const contact = env.contacts.find(c => c.id === cid);
                    if (contact) {
                        contact.status = "won";
                        contact.company = company;
                        contact.niche = niche;
                        contact.value = price;
                        contact.timeline.push({
                            id: "act_" + Date.now(),
                            type: "note",
                            description: `Cadastrado como cliente direto para o serviço: ${productName} (${formatCurrency(price)})`,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }

            saveState();
            document.getElementById("customerModal").classList.remove("active");
            renderAll();
        });
    }
});

function updateCalendarNotifications() {
    const env = getEnv();
    const badge = document.getElementById("notificationBadge");
    const list = document.getElementById("notificationsList");
    if (!badge || !list) return;
    
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    
    const overdueTasks = (env.tasks || []).filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
    const todayTasks = (env.tasks || []).filter(t => !t.completed && t.dueDate && t.dueDate === todayStr);
    
    const allEvents = [...(env.events || [])].sort((a,b) => a.date.localeCompare(b.date));
    const upcomingEvents = allEvents.filter(evt => evt.date >= todayStr);
    
    const todayEventsCount = allEvents.filter(evt => evt.date === todayStr).length;
    const totalAlertsCount = todayEventsCount + overdueTasks.length + todayTasks.length;
    
    if (totalAlertsCount > 0) {
        badge.innerText = totalAlertsCount;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
    
    const overdueBanner = document.getElementById("overdueTasksBanner");
    if (overdueBanner) {
        overdueBanner.classList.add("hidden");
    }
    
    list.innerHTML = "";
    
    if (overdueTasks.length > 0 || todayTasks.length > 0) {
        const taskSectionHeader = document.createElement("div");
        taskSectionHeader.innerHTML = `<h4 style="font-size:12px; font-weight:700; color:var(--color-danger); margin-bottom:8px; display:flex; align-items:center; gap:6px;"><i data-lucide="alert-circle" style="width:14px;height:14px;"></i> Alertas de Tarefas (${overdueTasks.length + todayTasks.length})</h4>`;
        list.appendChild(taskSectionHeader);
        
        overdueTasks.concat(todayTasks).forEach(t => {
            const isOverdue = t.dueDate < todayStr;
            const item = document.createElement("div");
            item.style.padding = "10px 12px";
            item.style.marginBottom = "8px";
            item.style.background = isOverdue ? "rgba(239, 68, 68, 0.05)" : "rgba(245, 158, 11, 0.05)";
            item.style.border = isOverdue ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)";
            item.style.borderRadius = "var(--radius-sm)";
            item.style.display = "flex";
            item.style.justifyContent = "space-between";
            item.style.alignItems = "center";
            item.style.cursor = "pointer";
            
            item.onclick = () => {
                document.getElementById("notificationsModal").classList.remove("active");
                switchView('tasks');
                window.taskActiveFilterOverride = isOverdue ? 'overdue' : 'pending';
                renderTasks();
            };
            
            item.innerHTML = `
                <div style="flex:1; padding-right:8px;">
                    <span style="font-weight:600; font-size:12.5px; display:block; color:var(--text-primary);">${t.title}</span>
                    <span style="font-size:11px; color:${isOverdue ? 'var(--color-danger)' : 'var(--color-warning)'};">${isOverdue ? 'Atrasada' : 'Vence Hoje'}: ${formatDate(t.dueDate)}</span>
                </div>
                <span class="badge-status ${isOverdue ? 'overdue' : 'pending_partial'}" style="font-size:9px; padding:2px 6px; flex-shrink:0;">${t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}</span>
            `;
            list.appendChild(item);
        });
        
        const divider = document.createElement("hr");
        divider.style.border = "none";
        divider.style.borderTop = "1px solid var(--border-color)";
        divider.style.margin = "12px 0";
        list.appendChild(divider);
    }
    
    const eventsSectionHeader = document.createElement("div");
    eventsSectionHeader.innerHTML = `<h4 style="font-size:12px; font-weight:700; color:var(--color-primary); margin-bottom:8px; display:flex; align-items:center; gap:6px;"><i data-lucide="calendar" style="width:14px;height:14px;"></i> Compromissos da Agenda</h4>`;
    list.appendChild(eventsSectionHeader);
    
    if (upcomingEvents.length === 0) {
        const noEvts = document.createElement("div");
        noEvts.style.textAlign = "center";
        noEvts.style.color = "var(--text-muted)";
        noEvts.style.padding = "10px 0";
        noEvts.style.fontSize = "13px";
        noEvts.innerText = "Nenhum compromisso agendado a partir de hoje.";
        list.appendChild(noEvts);
        return;
    }
    
    upcomingEvents.forEach(evt => {
        const item = document.createElement("div");
        item.style.padding = "10px 12px";
        item.style.background = "var(--bg-app)";
        item.style.border = "1px solid var(--border-color)";
        item.style.borderRadius = "var(--radius-sm)";
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.gap = "4px";
        item.style.marginBottom = "8px";
        
        let dayLabel = formatDateBr(evt.date);
        let dayBadgeColor = "var(--color-primary)";
        let dayBadgeBg = "var(--color-primary-glow)";
        
        if (evt.date === todayStr) {
            dayLabel = "Hoje";
            dayBadgeColor = "var(--color-danger)";
            dayBadgeBg = "rgba(239, 68, 68, 0.1)";
        } else if (evt.date === tomorrowStr) {
            dayLabel = "Amanhã";
            dayBadgeColor = "var(--color-warning)";
            dayBadgeBg = "rgba(245, 158, 11, 0.1)";
        }
        
        const contactName = evt.contactId ? (env.contacts.find(c => c.id === evt.contactId)?.name || "") : "";
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${evt.title}</span>
                <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; color: ${dayBadgeColor}; background: ${dayBadgeBg};">${dayLabel} às ${evt.time || "00:00"}</span>
            </div>
            ${contactName ? `<div style="font-size: 11px; color: var(--text-secondary);">Contato: <strong>${contactName}</strong></div>` : ''}
            ${evt.description ? `<div style="font-size: 11px; color: var(--text-muted); font-style: italic; margin-top: 2px;">${evt.description}</div>` : ''}
        `;
        list.appendChild(item);
    });
}

// Render finance "Por Cliente" panel
function renderByClient(env) {
    const tbody = document.getElementById('byClientTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const todayStr = new Date().toISOString().split('T')[0];
    const clientMap = {};
    env.invoices.forEach(inv => {
        const isInvOverdue = inv.status === 'overdue' || (inv.status === 'pending' && inv.dueDate && inv.dueDate < todayStr);
        const key = (inv.company && inv.company.trim() !== '-') ? inv.company.trim() : (inv.customerName || 'Desconhecido');
        if (!clientMap[key]) {
            clientMap[key] = { name: inv.customerName || key, company: key, niche: inv.niche || '-', paid: 0, pending: 0, overdue: 0 };
        }
        if (inv.status === 'paid') clientMap[key].paid += inv.value;
        else if (isInvOverdue) clientMap[key].overdue += inv.value;
        else clientMap[key].pending += inv.value;
    });
    
    const sorted = Object.values(clientMap).sort((a, b) => (b.paid + b.pending + b.overdue) - (a.paid + a.pending + a.overdue));
    
    if (sorted.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px;">Nenhuma fatura registrada.</td></tr>`;
        return;
    }
    
    sorted.forEach(c => {
        const isOverdue = c.overdue > 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="col-contact-info">
                    <div class="contact-avatar">${getInitials(c.company)}</div>
                    <div>
                        <span style="font-weight:600;display:block;">${c.company}</span>
                        <span style="font-size:11px;color:var(--text-muted);">${c.name !== c.company ? c.name : ''}</span>
                    </div>
                </div>
            </td>
            <td><span class="niche-tag">${c.niche}</span></td>
            <td><strong style="color:var(--color-success);">${formatCurrency(c.paid)}</strong></td>
            <td><strong style="color:var(--color-warning);">${formatCurrency(c.pending)}</strong></td>
            <td>${c.overdue > 0 ? `<strong style="color:var(--color-danger);">${formatCurrency(c.overdue)}</strong>` : '<span style="color:var(--text-muted);">-</span>'}</td>
            <td>${isOverdue ? '<span class="badge-overdue">⚠ Inadimplente</span>' : '<span class="badge-status active">Em dia</span>'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Render finance "Inadimplência" panel
function renderOverdue(env) {
    const overdueBody = document.getElementById('overdueTableBody');
    const overdueEmpty = document.getElementById('overdueEmptyState');
    if (!overdueBody) return;
    overdueBody.innerHTML = '';
    
    const today = new Date();
    const overdue = env.invoices.filter(inv => inv.status === 'overdue' || 
        (inv.status === 'pending' && inv.dueDate && inv.dueDate < today.toISOString().split('T')[0]));
    
    if (overdue.length === 0) {
        if (overdueEmpty) overdueEmpty.classList.remove('hidden');
        return;
    }
    if (overdueEmpty) overdueEmpty.classList.add('hidden');
    
    overdue.forEach(inv => {
        const dueDate = new Date(inv.dueDate);
        const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${inv.id}</strong></td>
            <td><strong>${inv.customerName || inv.company}</strong><br><small style="color:var(--text-muted);">${inv.company || ''}</small></td>
            <td><strong>${inv.productName || '-'}</strong></td>
            <td style="color:var(--color-danger); font-weight: 500;">${formatDate(inv.dueDate)}</td>
            <td><span class="badge-overdue">${daysLate > 0 ? `${daysLate} dias` : 'Hoje'}</span></td>
            <td><strong style="color:var(--color-danger);">${formatCurrency(inv.value)}</strong></td>
            <td>
                <div class="kanban-card-actions">
                    <button class="btn-icon-only btn-pay-overdue" title="Confirmar Recebimento" style="color:var(--color-success);"><i data-lucide="check" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-edit-overdue" title="Editar" style="color:var(--color-primary);"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-overdue" title="Remover" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        `;
        tr.querySelector('.btn-pay-overdue').onclick = () => {
            inv.status = 'paid';
            saveState();
            renderOverdue(env);
            renderFinance();
            renderDashboard();
            showToast('✅ Fatura marcada como recebida! Saldo atualizado.', 'success');
        };
        const editOverdueFn = () => {
            const newVal = prompt('Editar valor da fatura (R$):', inv.value);
            if (newVal === null) return;
            const newDate = prompt('Editar data de vencimento (AAAA-MM-DD):', inv.dueDate || '');
            if (newDate === null) return;
            inv.value = parseFloat(newVal) || inv.value;
            inv.dueDate = newDate || inv.dueDate;
            saveState();
            renderOverdue(env);
            renderFinance();
            renderDashboard();
            showToast('Fatura atualizada!', 'success');
        };

        tr.querySelector('.btn-edit-overdue').onclick = editOverdueFn;

        // Make cells clickable to edit (excluding the actions td)
        const cells = tr.querySelectorAll('td');
        for (let i = 0; i < cells.length - 1; i++) {
            cells[i].style.cursor = 'pointer';
            cells[i].onclick = editOverdueFn;
        }

        tr.querySelector('.btn-delete-overdue').onclick = () => {
            if (confirm('Remover esta fatura vencida?')) {
                env.invoices = env.invoices.filter(i => i.id !== inv.id);
                saveState();
                renderOverdue(env);
                renderFinance();
                renderDashboard();
                showToast('Fatura removida!', 'info');
            }
        };
        overdueBody.appendChild(tr);
    });
    safeCreateIcons();
}

// ===== SERVIÇOS CONTRATADOS =====
function renderServices() {
    const env = getEnv();
    if (!env.contractedServices) env.contractedServices = [];

    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    // KPIs
    const active = env.contractedServices.filter(s => s.status === 'active');
    const monthly = active.reduce((sum, s) => {
        if (s.recurrence === 'monthly')   return sum + (s.value||0);
        if (s.recurrence === 'quarterly') return sum + (s.value||0) / 3;
        if (s.recurrence === 'annual')    return sum + (s.value||0) / 12;
        return sum;
    }, 0);
    const annual = monthly * 12;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    set('svcKpiMonthly', formatCurrency(monthly));
    set('svcKpiAnnual',  formatCurrency(annual));
    set('svcKpiCount',   active.length);

    if (env.contractedServices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px;">Nenhum serviço contratado. Clique em "Novo Serviço" para adicionar.</td></tr>`;
        return;
    }

    const recurrenceLabel = { monthly: 'Mensal', quarterly: 'Trimestral', annual: 'Anual' };
    const statusBadge = {
        active:    `<span style="background:var(--color-success-bg);color:var(--color-success);padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">Ativo</span>`,
        paused:    `<span style="background:var(--color-warning-bg);color:var(--color-warning);padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">Pausado</span>`,
        cancelled: `<span style="background:var(--color-danger-bg);color:var(--color-danger);padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;">Cancelado</span>`
    };

    const today = new Date().toISOString().split('T')[0];
    tbody.innerHTML = '';
    env.contractedServices.forEach(svc => {
        const tr = document.createElement('tr');
        const isOverdue = svc.nextDue && svc.nextDue < today && svc.status === 'active';
        tr.innerHTML = `
            <td><strong>${svc.name}</strong>${svc.notes ? `<br><small style="color:var(--text-muted)">${svc.notes}</small>` : ''}</td>
            <td>${getCategoryBadgeHtml(svc.category)}</td>
            <td>${svc.supplier||'-'}</td>
            <td>${getRecurrenceBadgeHtml(svc.recurrence)}</td>
            <td style="color:${isOverdue ? 'var(--color-danger)' : 'inherit'};font-weight:${isOverdue ? '600' : '400'};">${formatDate(svc.nextDue)||'-'}</td>
            <td style="color:var(--color-danger);font-weight:700;">${formatCurrency(svc.value)}</td>
            <td>${statusBadge[svc.status]||'-'}</td>
            <td>
                <div class="kanban-card-actions">
                    <button class="btn-icon-only btn-edit-svc" title="Editar" style="color:var(--color-primary);"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-svc" title="Excluir" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>`;

        const editSvcFn = () => openServiceModal(svc.id);
        tr.querySelector('.btn-edit-svc').onclick = editSvcFn;

        // Make cells clickable to edit (excluding the actions td)
        const cells = tr.querySelectorAll('td');
        for (let i = 0; i < cells.length - 1; i++) {
            cells[i].style.cursor = 'pointer';
            cells[i].onclick = editSvcFn;
        }

        tr.querySelector('.btn-delete-svc').onclick = () => {
            if (confirm(`Remover "${svc.name}"?`)) {
                env.contractedServices = env.contractedServices.filter(s => s.id !== svc.id);
                saveState();
                renderServices();
                renderFinance();
            }
        };
        tbody.appendChild(tr);
    });
    safeCreateIcons();
}

function openServiceModal(id = null) {
    const env = getEnv();
    const modal = document.getElementById('serviceModal');
    if (!modal) return;

    const form = document.getElementById('serviceForm');
    form.reset();
    document.getElementById('serviceEditId').value = '';

    if (id) {
        const svc = (env.contractedServices||[]).find(s => s.id === id);
        if (svc) {
            document.getElementById('serviceModalTitle').textContent = 'Editar Serviço';
            document.getElementById('serviceEditId').value  = id;
            document.getElementById('serviceName').value    = svc.name||'';
            document.getElementById('serviceCategory').value = svc.category||'SaaS';
            document.getElementById('serviceSupplier').value = svc.supplier||'';
            document.getElementById('serviceValue').value   = svc.value||'';
            document.getElementById('serviceRecurrence').value = svc.recurrence||'monthly';
            document.getElementById('serviceNextDue').value = svc.nextDue||'';
            document.getElementById('serviceStatus').value  = svc.status||'active';
            document.getElementById('serviceNotes').value   = svc.notes||'';
        }
    } else {
        document.getElementById('serviceModalTitle').textContent = 'Novo Serviço Contratado';
    }

    modal.classList.add('active');

    // Close handlers (re-bind each time)
    document.getElementById('btnCloseServiceModal').onclick  = () => modal.classList.remove('active');
    document.getElementById('btnCancelServiceModal').onclick = () => modal.classList.remove('active');

    const serviceForm = document.getElementById('serviceForm');
    serviceForm.onsubmit = (e) => {
        e.preventDefault();
        if (!env.contractedServices) env.contractedServices = [];
        const editId = document.getElementById('serviceEditId').value;
        const data = {
            id:          editId || 'SVC-' + Date.now(),
            name:        document.getElementById('serviceName').value.trim(),
            category:    document.getElementById('serviceCategory').value,
            supplier:    document.getElementById('serviceSupplier').value.trim(),
            value:       parseFloat(document.getElementById('serviceValue').value)||0,
            recurrence:  document.getElementById('serviceRecurrence').value,
            nextDue:     document.getElementById('serviceNextDue').value,
            status:      document.getElementById('serviceStatus').value,
            notes:       document.getElementById('serviceNotes').value.trim(),
            createdAt:   editId ? undefined : new Date().toISOString()
        };
        if (editId) {
            const idx = env.contractedServices.findIndex(s => s.id === editId);
            if (idx >= 0) env.contractedServices[idx] = { ...env.contractedServices[idx], ...data };
        } else {
            env.contractedServices.push(data);
        }
        saveState();
        modal.classList.remove('active');
        renderServices();
        renderFinance();
        showToast(editId ? 'Serviço atualizado!' : 'Serviço adicionado!', 'success');
    };
}

function renderFiscalNotes() {
    const env = getEnv();
    const tbody = document.getElementById("fiscalNotesTableBody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    if (!env.fiscalNotes || env.fiscalNotes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma nota fiscal lançada.</td></tr>`;
        return;
    }
    
    const sorted = [...env.fiscalNotes].sort((a,b) => b.issueDate.localeCompare(a.issueDate));
    
    sorted.forEach(nf => {
        const tr = document.createElement("tr");
        
        let receiptHtml = "";
        if (nf.receiptId) {
            receiptHtml = `<span class="badge-status active" style="background: rgba(16, 185, 129, 0.1); color: var(--color-success); font-size: 10px; padding: 2px 6px; border-radius: 4px;">🟢 Lançado (Pago)</span>`;
        } else {
            receiptHtml = `<button class="btn btn-secondary btn-xs btn-generate-receipt-from-note" data-id="${nf.id}" style="font-size: 10px; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;"><i data-lucide="plus-circle" style="width:10px;height:10px;"></i> Gerar Recebimento</button>`;
        }
        
        tr.innerHTML = `
            <td><strong>${nf.number}</strong></td>
            <td>${nf.clientName}</td>
            <td>${nf.productName}</td>
            <td>${formatDateBr(nf.issueDate)}</td>
            <td><strong>${formatCurrency(nf.value)}</strong></td>
            <td>${receiptHtml}</td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn-icon-only btn-sm btn-edit-fiscal-note" data-id="${nf.id}" title="Editar" style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button>
                    <button class="btn-icon-only btn-sm btn-delete-fiscal-note" data-id="${nf.id}" title="Excluir" style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
                </div>
            </td>
        `;
        
        if (!nf.receiptId) {
            tr.querySelector(".btn-generate-receipt-from-note").onclick = () => {
                generateReceiptFromFiscalNote(nf.id);
            };
        }
        
        tr.querySelector(".btn-edit-fiscal-note").onclick = () => {
            openEditFiscalNote(nf.id);
        };
        
        tr.querySelector(".btn-delete-fiscal-note").onclick = () => {
            deleteFiscalNote(nf.id);
        };
        
        tbody.appendChild(tr);
    });
    
    safeCreateIcons();
}

function generateReceiptFromFiscalNote(id) {
    const env = getEnv();
    const nf = env.fiscalNotes.find(x => x.id === id);
    if (!nf) return;
    
    const newInvoice = {
        id: "FAT-" + Date.now().toString().substring(8),
        customerName: nf.clientName,
        company: "-",
        niche: "Outro",
        productName: nf.productName + ` (Ref: NF ${nf.number})`,
        value: nf.value,
        dueDate: nf.issueDate,
        status: "paid"
    };
    env.invoices.push(newInvoice);
    
    nf.receiptId = newInvoice.id;
    
    saveState();
    renderAll();
    
    const tabInvoices = document.getElementById("tabInvoices");
    if (tabInvoices) tabInvoices.click();
    
    showToast("Recebimento lançado com sucesso!", "success");
}

function openAddFiscalNote() {
    document.getElementById("fiscalNoteForm").reset();
    document.getElementById("fiscalNoteId").value = "";
    document.getElementById("fiscalNoteIssueDate").value = new Date().toISOString().split("T")[0];
    
    populateFiscalNoteDatalists();
    
    document.getElementById("fiscalNoteReceiptGroup").style.display = "flex";
    document.getElementById("fiscalNoteGenerateReceipt").checked = true;
    
    document.getElementById("fiscalNoteModalTitle").innerText = "Lançar Nota Fiscal";
    document.getElementById("fiscalNoteModal").classList.add("active");
}

function openEditFiscalNote(id) {
    const env = getEnv();
    const nf = env.fiscalNotes.find(x => x.id === id);
    if (!nf) return;
    
    document.getElementById("fiscalNoteForm").reset();
    document.getElementById("fiscalNoteId").value = nf.id;
    document.getElementById("fiscalNoteNumber").value = nf.number || "";
    document.getElementById("fiscalNoteIssueDate").value = nf.issueDate || "";
    
    populateFiscalNoteDatalists();
    
    document.getElementById("fiscalNoteClient").value = nf.clientName || "";
    document.getElementById("fiscalNoteProduct").value = nf.productName || "";
    document.getElementById("fiscalNoteValue").value = nf.value || "";
    
    document.getElementById("fiscalNoteReceiptGroup").style.display = "none";
    
    document.getElementById("fiscalNoteModalTitle").innerText = "Editar Nota Fiscal";
    document.getElementById("fiscalNoteModal").classList.add("active");
}

function deleteFiscalNote(id) {
    if (confirm("Tem certeza que deseja excluir esta nota fiscal?")) {
        const env = getEnv();
        env.fiscalNotes = env.fiscalNotes.filter(x => x.id !== id);
        saveState();
        renderAll();
    }
}

function populateFiscalNoteDatalists() {
    const env = getEnv();
    const clientsDatalist = document.getElementById("fiscalNoteClientsDatalist");
    const productsDatalist = document.getElementById("fiscalNoteProductsDatalist");
    if (!clientsDatalist || !productsDatalist) return;
    
    clientsDatalist.innerHTML = "";
    productsDatalist.innerHTML = "";
    
    const uniqueClients = [];
    env.customers.forEach(c => {
        const name = c.company || c.name;
        if (name && !uniqueClients.includes(name)) {
            uniqueClients.push(name);
        }
    });
    env.contacts.forEach(c => {
        const name = c.company || c.name;
        if (name && !uniqueClients.includes(name)) {
            uniqueClients.push(name);
        }
    });
    
    uniqueClients.sort().forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        clientsDatalist.appendChild(option);
    });
    
    const sortedProducts = [...env.products].sort((a,b) => a.name.localeCompare(b.name));
    sortedProducts.forEach(p => {
        const option = document.createElement("option");
        option.value = p.name;
        productsDatalist.appendChild(option);
    });
}

function renderImportHistory() {
    const env = getEnv();
    const list = document.getElementById("importHistoryList");
    if (!list) return;
    
    list.innerHTML = "";
    
    if (!env.importHistory || env.importHistory.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px 0; font-size: 13px;">Nenhum histórico de importação encontrado.</div>`;
        return;
    }
    
    const sorted = [...env.importHistory].sort((a,b) => b.date.localeCompare(a.date));
    
    sorted.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.style.border = "1px solid var(--border-color)";
        itemDiv.style.borderRadius = "var(--radius-sm)";
        itemDiv.style.background = "var(--bg-app)";
        itemDiv.style.padding = "12px";
        itemDiv.style.display = "flex";
        itemDiv.style.flexDirection = "column";
        itemDiv.style.gap = "8px";
        
        const dateFormatted = new Date(item.date).toLocaleString("pt-BR");
        
        itemDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="font-size:13px; color:var(--text-primary); display:block;">${item.fileName}</strong>
                    <span style="font-size:11px; color:var(--text-secondary);">${dateFormatted}</span>
                </div>
                <div style="display:flex; gap:6px;">
                    <span class="badge-status active" style="font-size:10px; padding:2px 6px; border-radius:4px;">${item.successCount} Sucessos</span>
                    ${item.failCount > 0 ? `<span class="badge-status inactive" style="font-size:10px; padding:2px 6px; border-radius:4px;">${item.failCount} Falhas</span>` : ''}
                </div>
            </div>
            <div>
                <button class="btn btn-secondary btn-xs btn-toggle-import-log-details" data-id="${item.id}" style="font-size:10px; padding:4px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:4px; cursor:pointer;"><i data-lucide="eye" style="width:10px;height:10px;"></i> Ver Logs Detalhados</button>
            </div>
            <div class="import-log-details hidden" id="details-${item.id}" style="border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px; font-family: monospace; font-size: 11px; color: var(--text-secondary); max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
                ${item.details.map(log => {
                    const isSuccess = log.includes("Sucesso");
                    const color = isSuccess ? "var(--color-success)" : "var(--color-danger)";
                    const bg = isSuccess ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)";
                    return `<div style="padding: 2px 4px; border-radius: 2px; background: ${bg}; color: ${color};">${log}</div>`;
                }).join("")}
            </div>
        `;
        
        itemDiv.querySelector(".btn-toggle-import-log-details").onclick = (e) => {
            const detailsDiv = itemDiv.querySelector(`#details-${item.id}`);
            const btn = e.currentTarget;
            if (detailsDiv.classList.contains("hidden")) {
                detailsDiv.classList.remove("hidden");
                btn.innerHTML = `<i data-lucide="eye-off" style="width:10px;height:10px;"></i> Ocultar Logs`;
            } else {
                detailsDiv.classList.add("hidden");
                btn.innerHTML = `<i data-lucide="eye" style="width:10px;height:10px;"></i> Ver Logs Detalhados`;
            }
            safeCreateIcons();
        };
        
        list.appendChild(itemDiv);
    });
    
    safeCreateIcons();
}

// ===== USER MANAGEMENT =====
function renderUsers() {
    const env = getEnv();
    if (!env.users) {
        env.users = [{ username: "Admin", password: "080125", name: "Admin", role: "Administrador" }];
    }
    
    const tbody = document.getElementById("usersTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    env.users.forEach(u => {
        const tr = document.createElement("tr");
        const isDefaultAdmin = u.username.toLowerCase() === "admin";
        
        tr.innerHTML = `
            <td><strong>${u.name || u.username}</strong></td>
            <td><code>${u.username}</code></td>
            <td><span style="-webkit-text-security: disc;">${u.password}</span></td>
            <td><span class="badge-status ${isDefaultAdmin ? 'active' : 'pending_partial'}" style="font-size: 11px;">${u.role || 'Colaborador'}</span></td>
            <td style="text-align: right;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn-icon-only btn-sm btn-edit-user" data-username="${u.username}" title="Editar Usuário" style="color:var(--color-primary);"><i data-lucide="pencil" style="width:12px;height:12px;"></i></button>
                    ${!isDefaultAdmin ? `<button class="btn-icon-only btn-sm btn-delete-user" data-username="${u.username}" title="Excluir Usuário" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>` : ''}
                </div>
            </td>
        `;
        
        tr.querySelector(".btn-edit-user").onclick = () => openUserEditModal(u.username);
        if (!isDefaultAdmin) {
            tr.querySelector(".btn-delete-user").onclick = () => {
                if (confirm(`Excluir o usuário "${u.name || u.username}"?`)) {
                    env.users = env.users.filter(x => x.username !== u.username);
                    saveState();
                    renderUsers();
                    populateUserDropdowns();
                    showToast("Usuário removido!", "info");
                }
            };
        }
        
        tbody.appendChild(tr);
    });
    safeCreateIcons();
}

function openUserEditModal(username) {
    const env = getEnv();
    const u = env.users.find(x => x.username === username);
    if (!u) return;
    
    document.getElementById("userFormId").value = u.username;
    document.getElementById("userFormName").value = u.name || "";
    document.getElementById("userFormUsername").value = u.username;
    document.getElementById("userFormUsername").disabled = true;
    document.getElementById("userFormPassword").value = u.password || "";
    document.getElementById("userFormRole").value = u.role || "Colaborador";
    
    document.getElementById("userModalTitle").innerText = "Editar Usuário";
    document.getElementById("userModal").classList.add("active");
}

function populateUserDropdowns() {
    const env = getEnv();
    if (!env.users) {
        env.users = [{ username: "Admin", password: "080125", name: "Admin", role: "Administrador" }];
    }
    
    const filterSelect = document.getElementById("filterTaskAssignee");
    if (filterSelect) {
        const currentVal = filterSelect.value;
        filterSelect.innerHTML = `<option value="all">Filtrar por Usuário</option>`;
        env.users.forEach(u => {
            filterSelect.innerHTML += `<option value="${u.username}">${u.name || u.username}</option>`;
        });
        filterSelect.value = currentVal;
    }
    
    const assignSelect = document.getElementById("taskAssignee");
    if (assignSelect) {
        const currentVal = assignSelect.value;
        assignSelect.innerHTML = "";
        env.users.forEach(u => {
            assignSelect.innerHTML += `<option value="${u.username}">${u.name || u.username}</option>`;
        });
        assignSelect.value = currentVal || "Admin";
    }
}

// User Modal Setup
const btnRegisterNewUser = document.getElementById("btnRegisterNewUser");
if (btnRegisterNewUser) {
    btnRegisterNewUser.onclick = () => {
        document.getElementById("userFormId").value = "";
        document.getElementById("userFormUsername").disabled = false;
        document.getElementById("userForm").reset();
        document.getElementById("userModalTitle").innerText = "Cadastrar Novo Usuário";
        document.getElementById("userModal").classList.add("active");
    };
}

const btnCloseUserModal = document.getElementById("btnCloseUserModal");
if (btnCloseUserModal) btnCloseUserModal.onclick = () => document.getElementById("userModal").classList.remove("active");

const btnCancelUserModal = document.getElementById("btnCancelUserModal");
if (btnCancelUserModal) btnCancelUserModal.onclick = () => document.getElementById("userModal").classList.remove("active");

const userForm = document.getElementById("userForm");
if (userForm) {
    userForm.onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const editId = document.getElementById("userFormId").value;
        const name = document.getElementById("userFormName").value.trim();
        const username = document.getElementById("userFormUsername").value.trim();
        const password = document.getElementById("userFormPassword").value.trim();
        const role = document.getElementById("userFormRole").value;
        
        if (editId) {
            const u = env.users.find(x => x.username === editId);
            if (u) {
                u.name = name;
                u.password = password;
                u.role = role;
                showToast("Usuário atualizado com sucesso!", "success");
            }
        } else {
            if (env.users.some(x => x.username.toLowerCase() === username.toLowerCase())) {
                alert("Erro: Este nome de usuário já está cadastrado!");
                return;
            }
            env.users.push({ username, password, name, role });
            showToast("Usuário cadastrado com sucesso!", "success");
        }
        
        saveState();
        document.getElementById("userModal").classList.remove("active");
        renderUsers();
        populateUserDropdowns();
    };
}

// Export functions to window
window.renderUsers = renderUsers;
window.populateUserDropdowns = populateUserDropdowns;

// ===== MESSAGE TEMPLATES =====
const CHANNEL_LABELS = {
    email: '📧 E-mail',
    whatsapp: '💬 WhatsApp',
    sms: '📱 SMS',
    outros: '📝 Outros'
};
const CHANNEL_COLORS = {
    email: { bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.25)', text: '#2563eb' },
    whatsapp: { bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.25)', text: '#059669' },
    sms: { bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.25)', text: '#d97706' },
    outros: { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)', text: '#6b7280' }
};

function getTemplates() {
    const env = getEnv();
    if (!env.templates) env.templates = [];
    return env.templates;
}

let currentTemplateAttachments = [];

function renderTemplateAttachmentsList() {
    const container = document.getElementById('templateAttachmentsList');
    if (!container) return;
    container.innerHTML = '';
    currentTemplateAttachments.forEach((att, idx) => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-card-hover);border:1px solid var(--border-color);border-radius:var(--radius-sm);font-size:12px;';
        item.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1;">
                <i data-lucide="paperclip" style="width:13px;height:13px;color:var(--color-primary);flex-shrink:0;"></i>
                <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary);">${att.name}</span>
                <small style="color:var(--text-muted);flex-shrink:0;">(${Math.round(att.size / 1024)} KB)</small>
            </div>
            <button type="button" class="btn-icon-only btn-sm" style="color:var(--color-danger);border:none;background:transparent;cursor:pointer;" title="Remover anexo"><i data-lucide="x" style="width:12px;height:12px;"></i></button>
        `;
        item.querySelector('button').onclick = () => {
            currentTemplateAttachments.splice(idx, 1);
            renderTemplateAttachmentsList();
        };
        container.appendChild(item);
    });
    safeCreateIcons();
}

function renderTemplates() {
    const templates = getTemplates();
    const grid = document.getElementById('templatesGrid');
    const emptyState = document.getElementById('templatesEmptyState');
    if (!grid) return;

    const activeFilter = document.querySelector('#templateFilters li.active')?.getAttribute('data-tmpl-filter') || 'all';
    const filtered = activeFilter === 'all' ? templates : templates.filter(t => t.channel === activeFilter);

    grid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState?.classList.remove('hidden');
        return;
    }

    emptyState?.classList.add('hidden');

    filtered.forEach(tmpl => {
        const colors = CHANNEL_COLORS[tmpl.channel] || CHANNEL_COLORS.outros;
        const tags = (tmpl.tags || '').split(',').map(t => t.trim()).filter(Boolean);
        const tagsHtml = tags.map(t => `<span style="font-size:10px;background:var(--bg-card-hover);border:1px solid var(--border-color);color:var(--text-secondary);padding:2px 7px;border-radius:99px;">${t}</span>`).join('');
        const previewText = (tmpl.body || '').replace(/\n/g, ' ').substring(0, 120) + ((tmpl.body || '').length > 120 ? '…' : '');
        const attCount = (tmpl.attachments || []).length;
        const attBadge = attCount > 0 ? `<span style="font-size:11px;color:var(--color-primary);display:inline-flex;align-items:center;gap:3px;"><i data-lucide="paperclip" style="width:12px;height:12px;"></i> ${attCount} anexo${attCount > 1 ? 's' : ''}</span>` : '';

        const card = document.createElement('div');
        card.style.cssText = `background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:18px;display:flex;flex-direction:column;gap:12px;box-shadow:var(--shadow-sm);transition:box-shadow var(--transition-fast),transform var(--transition-fast);cursor:pointer;`;
        card.innerHTML = `
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                        <span style="font-size:11px;font-weight:600;background:${colors.bg};color:${colors.text};border:1px solid ${colors.border};padding:2px 9px;border-radius:99px;white-space:nowrap;">${CHANNEL_LABELS[tmpl.channel] || tmpl.channel}</span>
                        ${tmpl.subject ? `<span style="font-size:11px;color:var(--text-muted);">Assunto: <em>${tmpl.subject}</em></span>` : ''}
                        ${attBadge}
                    </div>
                    <h3 style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${tmpl.name}</h3>
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0;">
                    <button class="btn-icon-only btn-copy-template" data-id="${tmpl.id}" title="Copiar texto" style="color:var(--color-primary);"><i data-lucide="copy" style="width:13px;height:13px;"></i></button>
                    <button class="btn-icon-only btn-edit-template" data-id="${tmpl.id}" title="Editar modelo" style="color:var(--text-secondary);"><i data-lucide="pencil" style="width:13px;height:13px;"></i></button>
                    <button class="btn-icon-only btn-delete-template" data-id="${tmpl.id}" title="Excluir modelo" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>
                </div>
            </div>
            <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin:0;white-space:pre-wrap;">${previewText}</p>
            ${tagsHtml ? `<div style="display:flex;gap:5px;flex-wrap:wrap;">${tagsHtml}</div>` : ''}
            <div style="display:flex;gap:8px;border-top:1px solid var(--border-color);padding-top:10px;">
                <button class="btn btn-primary btn-xs btn-use-template" data-id="${tmpl.id}" style="font-size:11.5px;padding:5px 12px;flex:1;">
                    <i data-lucide="send" style="width:11px;height:11px;"></i> Usar Modelo
                </button>
                <button class="btn btn-secondary btn-xs btn-preview-template" data-id="${tmpl.id}" style="font-size:11.5px;padding:5px 12px;">
                    <i data-lucide="eye" style="width:11px;height:11px;"></i> Pré-visualizar
                </button>
            </div>
        `;

        // Hover effect
        card.addEventListener('mouseenter', () => { card.style.boxShadow = 'var(--shadow-md)'; card.style.transform = 'translateY(-2px)'; });
        card.addEventListener('mouseleave', () => { card.style.boxShadow = 'var(--shadow-sm)'; card.style.transform = ''; });

        card.querySelector('.btn-copy-template').onclick = (e) => { e.stopPropagation(); copyTemplateText(tmpl); };
        card.querySelector('.btn-edit-template').onclick = (e) => { e.stopPropagation(); openTemplateModal(tmpl.id); };
        card.querySelector('.btn-delete-template').onclick = (e) => { e.stopPropagation(); deleteTemplate(tmpl.id); };
        card.querySelector('.btn-use-template').onclick = (e) => { e.stopPropagation(); openSendTemplateModal(tmpl.id, null); };
        card.querySelector('.btn-preview-template').onclick = (e) => { e.stopPropagation(); previewTemplate(tmpl); };

        grid.appendChild(card);
    });

    const btnOpenSmtp = document.getElementById('btnOpenSmtpConfig');
    if (btnOpenSmtp) {
        btnOpenSmtp.onclick = () => openSmtpConfigModal();
    }

    safeCreateIcons();
}

function replaceTemplateVariables(text, contact) {
    if (!text) return '';
    if (!contact) return text;

    const name = contact.name || '';
    const company = contact.company || '';
    const email = contact.email || '';
    const phone = contact.phone || '';
    const niche = contact.niche || '';
    const value = typeof formatCurrency === 'function' ? formatCurrency(contact.value || 0) : `R$ ${contact.value || 0}`;

    return text
        .replace(/\{\{\s*nome\s*\}\}|\[\s*nome\s*\]/gi, name)
        .replace(/\{\{\s*empresa\s*\}\}|\[\s*empresa\s*\]/gi, company)
        .replace(/\{\{\s*email\s*\}\}|\[\s*email\s*\]|\[\s*e-mail\s*\]/gi, email)
        .replace(/\{\{\s*telefone\s*\}\}|\[\s*telefone\s*\]|\[\s*whatsapp\s*\]/gi, phone)
        .replace(/\{\{\s*nicho\s*\}\}|\[\s*nicho\s*\]/gi, niche)
        .replace(/\{\{\s*valor\s*\}\}|\[\s*valor\s*\]/gi, value);
}

function openSendTemplateModal(templateId = null, contactId = null) {
    const env = getEnv();
    const modal = document.getElementById('sendTemplateModal');
    if (!modal) return;

    const contactSelect = document.getElementById('sendTemplateContactSelect');
    const templateSelect = document.getElementById('sendTemplateSelect');

    // Populate Contacts dropdown
    contactSelect.innerHTML = '<option value="">-- Selecione um Lead / Contato --</option>';
    (env.contacts || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name}${c.company ? ' (' + c.company + ')' : ''}${c.email ? ' - ' + c.email : ''}`;
        if (contactId && c.id === contactId) opt.selected = true;
        contactSelect.appendChild(opt);
    });

    // Populate Templates dropdown
    const templates = getTemplates();
    templateSelect.innerHTML = '<option value="">-- Selecione um Modelo --</option>';
    templates.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `[${CHANNEL_LABELS[t.channel] || t.channel}] ${t.name}`;
        if (templateId && t.id === templateId) opt.selected = true;
        templateSelect.appendChild(opt);
    });

    function updateFields() {
        const selectedContactId = contactSelect.value;
        const selectedTemplateId = templateSelect.value;

        const contact = (env.contacts || []).find(c => c.id === selectedContactId);
        const template = templates.find(t => t.id === selectedTemplateId);

        if (contact) {
            document.getElementById('sendTemplateRecipientEmail').value = contact.email || '';
            document.getElementById('sendTemplateRecipientPhone').value = contact.phone || '';
        } else {
            document.getElementById('sendTemplateRecipientEmail').value = '';
            document.getElementById('sendTemplateRecipientPhone').value = '';
        }

        if (template) {
            const rawSubject = template.subject || '';
            const rawBody = template.body || '';

            document.getElementById('sendTemplateSubject').value = contact ? replaceTemplateVariables(rawSubject, contact) : rawSubject;
            document.getElementById('sendTemplateBody').value = contact ? replaceTemplateVariables(rawBody, contact) : rawBody;
        } else {
            document.getElementById('sendTemplateSubject').value = '';
            document.getElementById('sendTemplateBody').value = '';
        }
    }

    contactSelect.onchange = updateFields;
    templateSelect.onchange = updateFields;

    updateFields();

    // Wire buttons
    const closeSendModal = () => modal.classList.remove('active');
    document.getElementById('btnCloseSendTemplateModal').onclick = closeSendModal;
    document.getElementById('btnCancelSendTemplateModal').onclick = closeSendModal;

    document.getElementById('btnSendTemplateEmail').onclick = () => {
        const email = document.getElementById('sendTemplateRecipientEmail').value.trim();
        const subject = document.getElementById('sendTemplateSubject').value.trim();
        const body = document.getElementById('sendTemplateBody').value.trim();
        const selectedContactId = contactSelect.value;
        const shouldLog = document.getElementById('sendTemplateLogActivity').checked;

        if (!email) {
            showToast('Por favor, informe o e-mail do destinatário.', 'warning');
            return;
        }

        const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;

        if (shouldLog && selectedContactId) {
            const contact = (env.contacts || []).find(c => c.id === selectedContactId);
            if (contact) {
                if (!contact.timeline) contact.timeline = [];
                contact.timeline.push({
                    id: 'act_' + Date.now(),
                    type: 'email',
                    description: `E-mail iniciado com modelo: "${subject || 'Contato'}"`,
                    timestamp: new Date().toISOString()
                });
                saveState();
                if (typeof renderTimeline === 'function' && document.getElementById('activityContactId')?.value === contact.id) {
                    renderTimeline(contact);
                }
            }
        }

        showToast('✉️ Leitor de e-mail iniciado!', 'success');
        closeSendModal();
    };

    document.getElementById('btnSendTemplateWhatsapp').onclick = () => {
        const phone = document.getElementById('sendTemplateRecipientPhone').value.trim();
        const body = document.getElementById('sendTemplateBody').value.trim();
        const selectedContactId = contactSelect.value;
        const shouldLog = document.getElementById('sendTemplateLogActivity').checked;

        if (!phone) {
            showToast('Por favor, informe o telefone/WhatsApp do destinatário.', 'warning');
            return;
        }

        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length >= 10 && !cleanPhone.startsWith('55')) {
            cleanPhone = '55' + cleanPhone;
        }

        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(body)}`;
        window.open(waUrl, '_blank');

        if (shouldLog && selectedContactId) {
            const contact = (env.contacts || []).find(c => c.id === selectedContactId);
            if (contact) {
                if (!contact.timeline) contact.timeline = [];
                contact.timeline.push({
                    id: 'act_' + Date.now(),
                    type: 'call',
                    description: `WhatsApp iniciado com modelo de mensagem`,
                    timestamp: new Date().toISOString()
                });
                saveState();
                if (typeof renderTimeline === 'function' && document.getElementById('activityContactId')?.value === contact.id) {
                    renderTimeline(contact);
                }
            }
        }

        showToast('💬 WhatsApp iniciado!', 'success');
        closeSendModal();
    };

    document.getElementById('btnCopySendTemplateText').onclick = () => {
        const subject = document.getElementById('sendTemplateSubject').value.trim();
        const body = document.getElementById('sendTemplateBody').value.trim();
        const textToCopy = subject ? `Assunto: ${subject}\n\n${body}` : body;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('✅ Conteúdo do e-mail copiado para a área de transferência!', 'success');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = textToCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('✅ Conteúdo copiado!', 'success');
        });
    };

    // Wire Direct Email Send via Hostinger SMTP
    const btnDirect = document.getElementById('btnSendTemplateDirect');
    if (btnDirect) {
        btnDirect.onclick = async () => {
            const email = document.getElementById('sendTemplateRecipientEmail').value.trim();
            const subject = document.getElementById('sendTemplateSubject').value.trim();
            const body = document.getElementById('sendTemplateBody').value.trim();
            const selectedContactId = contactSelect.value;
            const selectedTemplateId = templateSelect.value;
            const shouldLog = document.getElementById('sendTemplateLogActivity').checked;

            if (!email) {
                showToast('Por favor, informe o e-mail do destinatário.', 'warning');
                return;
            }

            const template = templates.find(t => t.id === selectedTemplateId);
            const attachments = template && template.attachments ? template.attachments : [];

            btnDirect.disabled = true;
            btnDirect.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:14px;height:14px;"></i> Disparando...`;
            safeCreateIcons();

            try {
                const response = await fetch(getApiUrl('/api/send-email'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: email,
                        subject: subject || 'Contato - WEBCO',
                        text: body,
                        attachments: attachments
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showToast('🚀 E-mail enviado com sucesso via Hostinger!', 'success');
                    
                    if (shouldLog && selectedContactId) {
                        const contact = (env.contacts || []).find(c => c.id === selectedContactId);
                        if (contact) {
                            if (!contact.timeline) contact.timeline = [];
                            contact.timeline.push({
                                id: 'act_' + Date.now(),
                                type: 'email',
                                description: `⚡ E-mail enviado via Hostinger: "${subject || 'Contato'}"`,
                                timestamp: new Date().toISOString()
                            });
                            saveState();
                            if (typeof renderTimeline === 'function' && document.getElementById('activityContactId')?.value === contact.id) {
                                renderTimeline(contact);
                            }
                        }
                    }
                    closeSendModal();
                } else {
                    showToast(`⚠️ ${data.error || 'Erro ao enviar e-mail via Hostinger.'}`, 'warning');
                    if (data.error && data.error.includes('configurad')) {
                        setTimeout(() => openSmtpConfigModal(), 1200);
                    }
                }
            } catch (err) {
                console.error("Error sending direct email:", err);
                showToast('❌ Falha na conexão com o servidor para envio de e-mail.', 'error');
            } finally {
                btnDirect.disabled = false;
                btnDirect.innerHTML = `<i data-lucide="send" style="width:14px;height:14px;"></i> ⚡ Disparar Direto (Hostinger)`;
                safeCreateIcons();
            }
        };
    }

    modal.classList.add('active');
    safeCreateIcons();
}

async function openSmtpConfigModal() {
    const modal = document.getElementById('smtpConfigModal');
    if (!modal) return;

    const hostInput = document.getElementById('smtpFormHost');
    const portSelect = document.getElementById('smtpFormPort');
    const userInput = document.getElementById('smtpFormUser');
    const fromNameInput = document.getElementById('smtpFormFromName');
    const passInput = document.getElementById('smtpFormPass');
    const passHelp = document.getElementById('smtpPassHelpText');

    passInput.value = '';
    
    try {
        const response = await fetch(getApiUrl('/api/smtp-config'));
        if (response.ok) {
            const data = await response.json();
            if (data) {
                hostInput.value = data.host || 'smtp.hostinger.com';
                portSelect.value = String(data.port || 465);
                userInput.value = data.user || '';
                fromNameInput.value = data.fromName || '';
                if (data.hasPassword && passHelp) {
                    passHelp.innerText = "🔒 Senha já cadastrada no servidor. Deixe em branco se não quiser alterar.";
                } else if (passHelp) {
                    passHelp.innerText = "Sua senha é armazenada de forma segura no servidor do sistema.";
                }
            }
        }
    } catch (e) {
        console.warn("Erro ao buscar configurações SMTP:", e);
    }

    const closeModal = () => modal.classList.remove('active');
    document.getElementById('btnCloseSmtpModal').onclick = closeModal;
    document.getElementById('btnCancelSmtpModal').onclick = closeModal;

    const testBtn = document.getElementById('btnTestSmtpConfig');
    if (testBtn) {
        testBtn.onclick = async () => {
            testBtn.disabled = true;
            testBtn.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:14px;height:14px;"></i> Testando...`;
            safeCreateIcons();

            try {
                const resp = await fetch(getApiUrl('/api/test-smtp'), { method: 'POST' });
                const resData = await resp.json();
                if (resp.ok && resData.success) {
                    showToast(`✅ ${resData.message}`, 'success');
                } else {
                    showToast(`❌ ${resData.error || 'Falha ao autenticar com a Hostinger.'}`, 'error');
                }
            } catch (err) {
                showToast('❌ Erro ao testar conexão SMTP.', 'error');
            } finally {
                testBtn.disabled = false;
                testBtn.innerHTML = `<i data-lucide="shield-check" style="width:14px;height:14px;"></i> Testar Conexão`;
                safeCreateIcons();
            }
        };
    }

    const form = document.getElementById('smtpConfigForm');
    form.onsubmit = async (e) => {
        e.preventDefault();

        const host = hostInput.value.trim();
        const port = Number(portSelect.value);
        const user = userInput.value.trim();
        const fromName = fromNameInput.value.trim();
        const pass = passInput.value;

        const saveBtn = document.getElementById('btnSaveSmtpConfig');
        saveBtn.disabled = true;
        saveBtn.innerText = 'Salvando...';

        try {
            const resp = await fetch(getApiUrl('/api/smtp-config'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ host, port, secure: port === 465, user, pass, fromName })
            });

            const resData = await resp.json();
            if (resp.ok && resData.success) {
                showToast('✅ Configurações SMTP da Hostinger salvas com sucesso!', 'success');
                closeModal();
            } else {
                showToast(`❌ ${resData.error || 'Erro ao salvar SMTP.'}`, 'error');
            }
        } catch (err) {
            console.error("Erro ao salvar SMTP:", err);
            showToast('❌ Erro de comunicação com o servidor.', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `<i data-lucide="save" style="width:14px;height:14px;"></i> Salvar Configurações`;
            safeCreateIcons();
        }
    };

    modal.classList.add('active');
    safeCreateIcons();
}

function copyTemplateText(tmpl) {
    const text = tmpl.subject ? `Assunto: ${tmpl.subject}\n\n${tmpl.body}` : tmpl.body;
    navigator.clipboard.writeText(text).then(() => {
        showToast(`✅ Modelo "${tmpl.name}" copiado para a área de transferência!`, 'success');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`✅ Modelo "${tmpl.name}" copiado!`, 'success');
    });
}

function downloadAttachment(att) {
    const a = document.createElement('a');
    a.href = att.data;
    a.download = att.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function previewTemplate(tmpl) {
    const colors = CHANNEL_COLORS[tmpl.channel] || CHANNEL_COLORS.outros;
    const existing = document.getElementById('templatePreviewModal');
    if (existing) existing.remove();

    const attachments = tmpl.attachments || [];
    const attsHtml = attachments.length > 0 ? `
        <div style="margin-top:12px;padding:12px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);">
            <span style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:8px;">ANEXOS (${attachments.length})</span>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${attachments.map(att => `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-card-hover);border-radius:var(--radius-sm);font-size:12px;">
                        <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                            <i data-lucide="paperclip" style="width:13px;height:13px;color:var(--color-primary);flex-shrink:0;"></i>
                            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary);">${att.name}</span>
                            <small style="color:var(--text-muted);">(${Math.round(att.size / 1024)} KB)</small>
                        </div>
                        <button type="button" class="btn btn-secondary btn-xs btn-dl-att" style="font-size:11px;padding:3px 8px;"><i data-lucide="download" style="width:11px;height:11px;"></i> Baixar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const modal = document.createElement('div');
    modal.id = 'templatePreviewModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:620px;width:100%;">
            <div class="modal-header">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:12px;font-weight:600;background:${colors.bg};color:${colors.text};border:1px solid ${colors.border};padding:3px 10px;border-radius:99px;">${CHANNEL_LABELS[tmpl.channel]}</span>
                    <h3 style="margin:0;">${tmpl.name}</h3>
                </div>
                <button class="btn-close" id="btnClosePreviewModal">&times;</button>
            </div>
            <div class="modal-body" style="padding-top:16px;">
                ${tmpl.subject ? `<div style="margin-bottom:12px;padding:10px 14px;background:var(--bg-card-hover);border-radius:var(--radius-sm);border:1px solid var(--border-color);"><span style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;">ASSUNTO</span><p style="margin:4px 0 0;font-weight:600;color:var(--text-primary);">${tmpl.subject}</p></div>` : ''}
                <div style="padding:16px;background:var(--bg-card-hover);border-radius:var(--radius-sm);border:1px solid var(--border-color);white-space:pre-wrap;font-size:13.5px;line-height:1.7;color:var(--text-primary);min-height:100px;max-height:360px;overflow-y:auto;">${tmpl.body}</div>
                ${attsHtml}
                ${tmpl.tags ? `<div style="margin-top:12px;display:flex;gap:5px;flex-wrap:wrap;">${tmpl.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `<span style="font-size:10px;background:var(--bg-card-hover);border:1px solid var(--border-color);color:var(--text-secondary);padding:2px 7px;border-radius:99px;">${t}</span>`).join('')}</div>` : ''}
            </div>
            <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
                <button type="button" class="btn btn-secondary" id="btnClosePreviewModal2">Fechar</button>
                <div style="display:flex;gap:8px;">
                    <button type="button" class="btn btn-secondary" id="btnCopyFromPreview"><i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar Texto</button>
                    <button type="button" class="btn btn-primary" id="btnSendFromPreview"><i data-lucide="send" style="width:13px;height:13px;"></i> Enviar a um Lead</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    safeCreateIcons();

    modal.querySelectorAll('.btn-dl-att').forEach((btn, i) => {
        btn.onclick = () => downloadAttachment(attachments[i]);
    });

    const close = () => modal.remove();
    modal.querySelector('#btnClosePreviewModal').onclick = close;
    modal.querySelector('#btnClosePreviewModal2').onclick = close;
    modal.querySelector('#btnCopyFromPreview').onclick = () => { copyTemplateText(tmpl); close(); };
    modal.querySelector('#btnSendFromPreview').onclick = () => { close(); openSendTemplateModal(tmpl.id, null); };
    modal.onclick = (e) => { if (e.target === modal) close(); };
}

function openTemplateModal(id) {
    const templates = getTemplates();
    const tmpl = id ? templates.find(t => t.id === id) : null;

    currentTemplateAttachments = tmpl && tmpl.attachments ? [...tmpl.attachments] : [];

    document.getElementById('templateFormId').value = tmpl ? tmpl.id : '';
    document.getElementById('templateFormName').value = tmpl ? tmpl.name : '';
    document.getElementById('templateFormChannel').value = tmpl ? tmpl.channel : 'email';
    document.getElementById('templateFormSubject').value = tmpl ? (tmpl.subject || '') : '';
    document.getElementById('templateFormBody').value = tmpl ? tmpl.body : '';
    document.getElementById('templateFormTags').value = tmpl ? (tmpl.tags || '') : '';
    document.getElementById('templateFormAttachments').value = '';
    document.getElementById('templateModalTitle').innerText = tmpl ? 'Editar Modelo de Mensagem' : 'Novo Modelo de Mensagem';

    updateTemplateSubjectVisibility();
    renderTemplateAttachmentsList();

    document.getElementById('templateModal').classList.add('active');
}

function updateTemplateSubjectVisibility() {
    const channel = document.getElementById('templateFormChannel')?.value;
    const subjectGroup = document.getElementById('templateSubjectGroup');
    if (subjectGroup) {
        subjectGroup.style.display = channel === 'email' ? '' : 'none';
    }
}

function deleteTemplate(id) {
    const env = getEnv();
    const tmpl = env.templates?.find(t => t.id === id);
    if (!tmpl) return;
    if (confirm(`Excluir o modelo "${tmpl.name}"? Esta ação não pode ser desfeita.`)) {
        env.templates = env.templates.filter(t => t.id !== id);
        saveState();
        renderTemplates();
        showToast('Modelo excluído!', 'info');
    }
}

// Wire template file input change
const templateFormAttachments = document.getElementById('templateFormAttachments');
if (templateFormAttachments) {
    templateFormAttachments.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        let processed = 0;
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                currentTemplateAttachments.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: evt.target.result
                });
                processed++;
                if (processed === files.length) {
                    renderTemplateAttachmentsList();
                    templateFormAttachments.value = '';
                }
            };
            reader.readAsDataURL(file);
        });
    });
}

// Wire template modal events
const btnNewTemplate = document.getElementById('btnNewTemplate');
if (btnNewTemplate) {
    btnNewTemplate.onclick = () => openTemplateModal(null);
}

const btnCloseTemplateModal = document.getElementById('btnCloseTemplateModal');
if (btnCloseTemplateModal) {
    btnCloseTemplateModal.onclick = () => document.getElementById('templateModal').classList.remove('active');
}

const btnCancelTemplateModal = document.getElementById('btnCancelTemplateModal');
if (btnCancelTemplateModal) {
    btnCancelTemplateModal.onclick = () => document.getElementById('templateModal').classList.remove('active');
}

// Close template modal on backdrop click
const templateModal = document.getElementById('templateModal');
if (templateModal) {
    templateModal.onclick = (e) => { if (e.target === templateModal) templateModal.classList.remove('active'); };
}

// Subject visibility toggle
const templateFormChannel = document.getElementById('templateFormChannel');
if (templateFormChannel) {
    templateFormChannel.addEventListener('change', updateTemplateSubjectVisibility);
}

// Template filter tabs
document.querySelectorAll('#templateFilters li').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('#templateFilters li').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderTemplates();
    });
});

// Template form submit
const templateForm = document.getElementById('templateForm');
if (templateForm) {
    templateForm.onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        if (!env.templates) env.templates = [];

        const id = document.getElementById('templateFormId').value;
        const name = document.getElementById('templateFormName').value.trim();
        const channel = document.getElementById('templateFormChannel').value;
        const subject = document.getElementById('templateFormSubject').value.trim();
        const body = document.getElementById('templateFormBody').value.trim();
        const tags = document.getElementById('templateFormTags').value.trim();
        const attachments = [...currentTemplateAttachments];

        if (id) {
            const existing = env.templates.find(t => t.id === id);
            if (existing) {
                Object.assign(existing, { name, channel, subject, body, tags, attachments, updatedAt: new Date().toISOString() });
                showToast('Modelo atualizado com sucesso!', 'success');
            }
        } else {
            env.templates.push({
                id: 'tmpl_' + Date.now(),
                name, channel, subject, body, tags, attachments,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            showToast('Modelo criado com sucesso!', 'success');
        }

        saveState();
        document.getElementById('templateModal').classList.remove('active');
        renderTemplates();
    };
}

window.renderDocuments = renderDocuments;

// ==========================================
// AGENTE COMERCIAL INTEGRATION HANDLERS
// ==========================================
const btnOpenAgenteSync = document.getElementById('btnOpenAgenteSync');
if (btnOpenAgenteSync) {
    btnOpenAgenteSync.onclick = () => {
        document.getElementById('agenteSyncModal').classList.add('active');
    };
}

const btnCloseAgenteSyncModal = document.getElementById('btnCloseAgenteSyncModal');
const btnCancelAgenteSyncModal = document.getElementById('btnCancelAgenteSyncModal');
const closeAgenteModal = () => document.getElementById('agenteSyncModal').classList.remove('active');
if (btnCloseAgenteSyncModal) btnCloseAgenteSyncModal.onclick = closeAgenteModal;
if (btnCancelAgenteSyncModal) btnCancelAgenteSyncModal.onclick = closeAgenteModal;

const btnCopyAgenteWebhook = document.getElementById('btnCopyAgenteWebhook');
if (btnCopyAgenteWebhook) {
    btnCopyAgenteWebhook.onclick = () => {
        const urlInput = document.getElementById('agenteWebhookUrl');
        if (urlInput) {
            navigator.clipboard.writeText(urlInput.value).then(() => {
                showToast('✅ URL do Webhook copiada com sucesso!', 'success');
            });
        }
    };
}

const btnSampleAgenteLeads = document.getElementById('btnSampleAgenteLeads');
if (btnSampleAgenteLeads) {
    btnSampleAgenteLeads.onclick = () => {
        const payloadInput = document.getElementById('agentePayloadInput');
        if (payloadInput) {
            payloadInput.value = JSON.stringify([
                {
                    "nome": "Rodrigo Mendes",
                    "empresa": "Mendes Logística & Transportes",
                    "email": "rodrigo.mendes@mendeslog.com.br",
                    "telefone": "(41) 98711-2233",
                    "nicho": "Serviços B2B",
                    "status": "contacted",
                    "valor": 3800.00,
                    "notas": "Contatado pelo Agente Comercial via WhatsApp. Demonstrou interesse em Criação de Site + Google Ads."
                },
                {
                    "nome": "Fernanda Lima",
                    "empresa": "Estética Premium Curitiba",
                    "email": "contato@esteticapremium.com.br",
                    "telefone": "(41) 99655-4433",
                    "nicho": "Saúde / Estética",
                    "status": "proposal",
                    "valor": 2900.00,
                    "notas": "Contatada pelo Agente Comercial. Solicitou envio de proposta comercial e portfólio por e-mail."
                }
            ], null, 2);
            showToast('✨ Exemplo de leads carregado!', 'info');
        }
    };
}

const btnExecuteAgenteSync = document.getElementById('btnExecuteAgenteSync');
if (btnExecuteAgenteSync) {
    btnExecuteAgenteSync.onclick = async () => {
        const payloadInput = document.getElementById('agentePayloadInput');
        const text = payloadInput ? payloadInput.value.trim() : '';

        if (!text) {
            showToast('Por favor, informe os dados dos leads em formato JSON ou utilize a URL do Webhook.', 'warning');
            return;
        }

        let parsedData = null;
        try {
            parsedData = JSON.parse(text);
        } catch (e) {
            showToast('O formato informado não é um JSON válido. Verifique a sintaxe.', 'danger');
            return;
        }

        try {
            const endpoint = typeof getApiUrl === 'function' ? getApiUrl('/api/webhook/agente-comercial') : '/api/webhook/agente-comercial';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData)
            });

            const data = await res.json();
            if (data.success) {
                showToast(data.message || 'Leads do Agente Comercial sincronizados com sucesso!', 'success');
                closeAgenteModal();
                if (typeof loadState === 'function') {
                    await loadState();
                }
                renderContacts();
                if (typeof renderKanban === 'function') renderKanban();
            } else {
                showToast(data.error || 'Erro ao sincronizar leads.', 'danger');
            }
        } catch (err) {
            console.error('Agente Sync Error:', err);
            showToast('Falha na comunicação com o servidor.', 'danger');
        }
    };
}

// ==========================================
// DOCUMENT REPOSITORY MODULE
// ==========================================
const DOC_CATEGORY_LABELS = {
    proposta: '📄 Proposta Comercial',
    portfolio: '🎨 Portfólio',
    contrato: '📑 Contrato / Briefing',
    outros: '📂 Outros Documentos'
};

const DOC_CATEGORY_COLORS = {
    proposta: { bg: 'rgba(79,70,229,0.1)', text: '#4F46E5', border: 'rgba(79,70,229,0.3)' },
    portfolio: { bg: 'rgba(6,182,212,0.1)', text: '#0891b2', border: 'rgba(6,182,212,0.3)' },
    contrato: { bg: 'rgba(217,119,6,0.1)', text: '#d97706', border: 'rgba(217,119,6,0.3)' },
    outros: { bg: 'rgba(107,114,128,0.1)', text: '#4b5563', border: 'rgba(107,114,128,0.3)' }
};

let docActiveCategory = 'all';
let docActiveLayout = 'grid'; // 'grid' or 'table'
let docSearchQuery = '';
let currentDocFile = null;

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '500 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}


function getAffiliates() {
    const env = getEnv();
    if (!env.affiliates) env.affiliates = [...defaultAffiliates];
    return env.affiliates;
}
function getDocuments() {
    const env = getEnv();
    if (!env.documents) env.documents = [...defaultDocuments];
    return env.documents;
}

function updateDocumentKpis() {
    const documents = getDocuments();
    const totalCount = documents.length;
    const totalBytes = documents.reduce((sum, d) => sum + (d.fileSize || 500000), 0);
    const propostasCount = documents.filter(d => d.category === 'proposta').length;
    const portfoliosCount = documents.filter(d => d.category === 'portfolio').length;
    const contratosCount = documents.filter(d => d.category === 'contrato').length;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('docKpiTotalCount', totalCount);
    setEl('docKpiTotalSize', `${formatFileSize(totalBytes)} em uso`);
    setEl('docKpiPropostasCount', propostasCount);
    setEl('docKpiPortfoliosCount', portfoliosCount);
    setEl('docKpiContratosCount', contratosCount);
}

function sendDocumentToLead(doc) {
    if (typeof openSendTemplateModal === 'function') {
        openSendTemplateModal(null, null);
        
        const subjInput = document.getElementById('sendTemplateSubject');
        const bodyInput = document.getElementById('sendTemplateBody');
        if (subjInput) subjInput.value = `Documento WEBCO: ${doc.title}`;
        if (bodyInput) {
            bodyInput.value = `Olá! Segue o documento "${doc.title}".\n\n${doc.description ? doc.description + '\n\n' : ''}Qualquer dúvida estamos à disposição!\n\nMatheus | WEBCO Agency`;
        }

        if (doc.fileData) {
            currentTemplateAttachments = [{
                name: doc.fileName || `${doc.title}.pdf`,
                size: doc.fileSize || 0,
                type: doc.fileType || 'application/pdf',
                data: doc.fileData
            }];
        }
        showToast(`✉️ Documento "${doc.title}" selecionado para envio!`, 'info');
    }
}

function renderDocuments() {
    updateDocumentKpis();

    const documents = getDocuments();
    const grid = document.getElementById('documentsGrid');
    const tableWrapper = document.getElementById('documentsTableWrapper');
    const tableBody = document.getElementById('documentsTableBody');
    const emptyState = document.getElementById('documentsEmptyState');
    if (!grid) return;

    let filtered = docActiveCategory === 'all' ? [...documents] : documents.filter(d => d.category === docActiveCategory);

    if (docSearchQuery) {
        const q = docSearchQuery.toLowerCase();
        filtered = filtered.filter(d => 
            (d.title || '').toLowerCase().includes(q) ||
            (d.description || '').toLowerCase().includes(q) ||
            (d.fileName || '').toLowerCase().includes(q) ||
            (d.tags || '').toLowerCase().includes(q)
        );
    }

    if (filtered.length === 0) {
        emptyState?.classList.remove('hidden');
        grid.innerHTML = '';
        if (tableBody) tableBody.innerHTML = '';
        if (tableWrapper) tableWrapper.classList.add('hidden');
        return;
    }

    emptyState?.classList.add('hidden');

    if (docActiveLayout === 'grid') {
        grid.classList.remove('hidden');
        tableWrapper?.classList.add('hidden');
        grid.innerHTML = '';

        filtered.forEach(doc => {
            const colors = DOC_CATEGORY_COLORS[doc.category] || DOC_CATEGORY_COLORS.outros;
            const tags = (doc.tags || '').split(',').map(t => t.trim()).filter(Boolean);
            const tagsHtml = tags.map(t => `<span style="font-size:10px;background:var(--bg-card-hover);border:1px solid var(--border-color);color:var(--text-secondary);padding:2px 7px;border-radius:99px;">${t}</span>`).join('');
            
            const isPdf = (doc.fileType || '').includes('pdf') || (doc.fileName || '').toLowerCase().endsWith('.pdf');
            const fileExt = (doc.fileName || '').split('.').pop().toUpperCase() || (isPdf ? 'PDF' : 'DOC');
            const iconName = isPdf ? 'file-text' : (doc.fileType || '').includes('image') ? 'image' : 'file';

            const card = document.createElement('div');
            card.style.cssText = `background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:18px;display:flex;flex-direction:column;gap:12px;box-shadow:var(--shadow-sm);transition:all var(--transition-fast);cursor:pointer;position:relative;`;
            card.innerHTML = `
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
                    <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
                        <div style="width:38px;height:38px;border-radius:var(--radius-sm);background:${colors.bg};border:1px solid ${colors.border};color:${colors.text};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;">
                            ${fileExt}
                        </div>
                        <div style="min-width:0;flex:1;">
                            <span style="font-size:10.5px;font-weight:600;color:${colors.text};text-transform:uppercase;letter-spacing:.04em;display:block;">${DOC_CATEGORY_LABELS[doc.category] || doc.category}</span>
                            <h3 style="font-size:14px;font-weight:700;color:var(--text-primary);margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${doc.title}">${doc.title}</h3>
                        </div>
                    </div>
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button class="btn-icon-only btn-edit-doc" data-id="${doc.id}" title="Editar documento" style="color:var(--text-secondary);"><i data-lucide="pencil" style="width:13px;height:13px;"></i></button>
                        <button class="btn-icon-only btn-delete-doc" data-id="${doc.id}" title="Excluir documento" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>
                    </div>
                </div>
                
                ${doc.description ? `<p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin:0;white-space:pre-wrap;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${doc.description}</p>` : ''}
                
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--text-muted);border-top:1px dashed var(--border-color);padding-top:8px;">
                    <span style="display:inline-flex;align-items:center;gap:4px;"><i data-lucide="${iconName}" style="width:12px;height:12px;color:var(--color-primary);"></i> ${doc.fileName || 'documento.pdf'}</span>
                    <span>${formatFileSize(doc.fileSize)}</span>
                </div>

                ${tagsHtml ? `<div style="display:flex;gap:5px;flex-wrap:wrap;">${tagsHtml}</div>` : ''}
                
                <div style="display:flex;gap:6px;border-top:1px solid var(--border-color);padding-top:10px;margin-top:auto;">
                    <button class="btn btn-primary btn-xs btn-preview-doc" data-id="${doc.id}" style="font-size:11.5px;padding:5px 10px;flex:1;">
                        <i data-lucide="eye" style="width:11px;height:11px;"></i> Visualizar
                    </button>
                    <button class="btn btn-secondary btn-xs btn-send-doc-lead" data-id="${doc.id}" style="font-size:11.5px;padding:5px 10px;" title="Enviar por E-mail ao Lead">
                        <i data-lucide="mail-plus" style="width:11px;height:11px;color:var(--color-primary);"></i> Enviar
                    </button>
                    <button class="btn btn-secondary btn-xs btn-download-doc" data-id="${doc.id}" style="font-size:11.5px;padding:5px 10px;" title="Baixar Arquivo">
                        <i data-lucide="download" style="width:11px;height:11px;"></i> Baixar
                    </button>
                </div>
            `;

            card.addEventListener('mouseenter', () => { card.style.boxShadow = 'var(--shadow-md)'; card.style.transform = 'translateY(-2px)'; });
            card.addEventListener('mouseleave', () => { card.style.boxShadow = 'var(--shadow-sm)'; card.style.transform = ''; });

            card.querySelector('.btn-edit-doc').onclick = (e) => { e.stopPropagation(); openDocumentModal(doc.id); };
            card.querySelector('.btn-delete-doc').onclick = (e) => { e.stopPropagation(); deleteDocument(doc.id); };
            card.querySelector('.btn-preview-doc').onclick = (e) => { e.stopPropagation(); previewDocument(doc); };
            card.querySelector('.btn-send-doc-lead').onclick = (e) => { e.stopPropagation(); sendDocumentToLead(doc); };
            card.querySelector('.btn-download-doc').onclick = (e) => { e.stopPropagation(); downloadDocumentFile(doc); };

            grid.appendChild(card);
        });
    } else {
        grid.classList.add('hidden');
        tableWrapper?.classList.remove('hidden');
        if (tableBody) {
            tableBody.innerHTML = '';
            filtered.forEach(doc => {
                const colors = DOC_CATEGORY_COLORS[doc.category] || DOC_CATEGORY_COLORS.outros;
                const isPdf = (doc.fileType || '').includes('pdf') || (doc.fileName || '').toLowerCase().endsWith('.pdf');
                const fileExt = (doc.fileName || '').split('.').pop().toUpperCase() || (isPdf ? 'PDF' : 'DOC');
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:30px;height:30px;border-radius:4px;background:${colors.bg};color:${colors.text};border:1px solid ${colors.border};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;">
                                ${fileExt}
                            </div>
                            <div>
                                <strong style="font-size:13px;color:var(--text-primary);">${doc.title}</strong>
                                ${doc.description ? `<small style="font-size:11px;color:var(--text-muted);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;">${doc.description}</small>` : ''}
                            </div>
                        </div>
                    </td>
                    <td><span style="font-size:11px;font-weight:600;background:${colors.bg};color:${colors.text};border:1px solid ${colors.border};padding:2px 8px;border-radius:99px;">${DOC_CATEGORY_LABELS[doc.category] || doc.category}</span></td>
                    <td><span style="font-size:12px;color:var(--text-secondary);">${doc.fileName || '-'}</span></td>
                    <td><span style="font-size:12px;color:var(--text-muted);">${formatFileSize(doc.fileSize)}</span></td>
                    <td><span style="font-size:12px;color:var(--text-muted);">${doc.createdAt ? formatDate(doc.createdAt) : '-'}</span></td>
                    <td style="text-align:right;">
                        <div style="display:flex;gap:6px;justify-content:flex-end;">
                            <button class="btn-icon-only btn-preview-doc" title="Visualizar Documento" style="color:var(--color-primary);"><i data-lucide="eye" style="width:14px;height:14px;"></i></button>
                            <button class="btn-icon-only btn-send-doc-lead" title="Enviar E-mail ao Lead" style="color:#10b981;"><i data-lucide="mail-plus" style="width:14px;height:14px;"></i></button>
                            <button class="btn-icon-only btn-download-doc" title="Baixar Arquivo" style="color:var(--text-secondary);"><i data-lucide="download" style="width:14px;height:14px;"></i></button>
                            <button class="btn-icon-only btn-edit-doc" title="Editar" style="color:var(--text-secondary);"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                            <button class="btn-icon-only btn-delete-doc" title="Excluir" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                        </div>
                    </td>
                `;

                tr.querySelector('.btn-preview-doc').onclick = () => previewDocument(doc);
                tr.querySelector('.btn-send-doc-lead').onclick = () => sendDocumentToLead(doc);
                tr.querySelector('.btn-download-doc').onclick = () => downloadDocumentFile(doc);
                tr.querySelector('.btn-edit-doc').onclick = () => openDocumentModal(doc.id);
                tr.querySelector('.btn-delete-doc').onclick = () => deleteDocument(doc.id);

                tableBody.appendChild(tr);
            });
        }
    }

    safeCreateIcons();
}

function openDocumentModal(id = null) {
    const documents = getDocuments();
    const doc = id ? documents.find(d => d.id === id) : null;
    currentDocFile = null;

    document.getElementById('documentFormId').value = doc ? doc.id : '';
    document.getElementById('documentFormTitle').value = doc ? doc.title : '';
    document.getElementById('documentFormCategory').value = doc ? doc.category : 'proposta';
    document.getElementById('documentFormDescription').value = doc ? (doc.description || '') : '';
    document.getElementById('documentFormTags').value = doc ? (doc.tags || '') : '';
    document.getElementById('documentFormFileInput').value = '';
    document.getElementById('documentModalTitle').innerText = doc ? 'Editar Documento' : 'Novo Documento';

    const fileHelp = document.getElementById('documentFormFileHelp');
    if (fileHelp) {
        fileHelp.innerText = doc && doc.fileName 
            ? `📄 Arquivo atual: "${doc.fileName}". Selecione um novo arquivo se desejar substituir.` 
            : 'Tamanho máximo recomendado: 15 MB por arquivo.';
    }

    const close = () => document.getElementById('documentModal').classList.remove('active');
    document.getElementById('btnCloseDocumentModal').onclick = close;
    document.getElementById('btnCancelDocumentModal').onclick = close;

    document.getElementById('documentModal').classList.add('active');
}

function deleteDocument(id) {
    const env = getEnv();
    const doc = (env.documents || []).find(d => d.id === id);
    if (!doc) return;
    if (confirm(`Excluir o documento "${doc.title}" do repositório?`)) {
        env.documents = env.documents.filter(d => d.id !== id);
        saveState();
        renderDocuments();
        showToast('Documento removido!', 'info');
    }
}

function previewDocument(doc) {
    const modal = document.getElementById('documentPreviewModal');
    if (!modal) return;

    document.getElementById('docPreviewTitle').innerText = doc.title || 'Visualizar Documento';
    const frame = document.getElementById('docPreviewFrame');

    if (doc.fileData && doc.fileData.startsWith('data:')) {
        frame.removeAttribute('srcdoc');
        frame.src = doc.fileData;
    } else {
        frame.removeAttribute('src');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; background: #ffffff; line-height: 1.6; }
                    .header { border-bottom: 2px solid #4F46E5; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                    .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
                    .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
                    .badge { background: rgba(79,70,229,0.1); color: #4F46E5; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; }
                    .content { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; font-size: 14px; color: #334155; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1 class="title">${doc.title}</h1>
                        <div class="subtitle">Documento Oficial WEBCO Agency</div>
                    </div>
                    <span class="badge">${DOC_CATEGORY_LABELS[doc.category] || doc.category}</span>
                </div>
                <div class="content">
                    <p><strong>Descrição:</strong> ${doc.description || 'Nenhuma descrição informada.'}</p>
                    <p><strong>Arquivo:</strong> ${doc.fileName || 'documento.pdf'}</p>
                    <p style="margin-top:20px;padding:16px;background:#ffffff;border-left:4px solid #4F46E5;border-radius:4px;">
                        ℹ️ Clique no botão <strong>Editar Documento</strong> e faça upload do seu PDF real do seu computador para ter a pré-visualização e download fieis ao arquivo original.
                    </p>
                </div>
                <div class="footer">WEBCO Agency &copy; 2026 - Todos os direitos reservados</div>
            </body>
            </html>
        `;
        frame.srcdoc = htmlContent;
    }

    const close = () => modal.classList.remove('active');
    document.getElementById('btnCloseDocPreviewModal').onclick = close;
    document.getElementById('btnCloseDocPreviewModal2').onclick = close;

    const btnEditFromPreview = document.getElementById('btnEditDocFromPreview');
    if (btnEditFromPreview) {
        btnEditFromPreview.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                openDocumentModal(doc.id);
            }, 100);
        };
    }

    document.getElementById('btnCopyDocInfo').onclick = () => {
        const text = `${doc.title}\n${doc.description ? doc.description + '\n' : ''}${doc.fileName ? 'Arquivo: ' + doc.fileName : ''}`;
        navigator.clipboard.writeText(text).then(() => showToast('✅ Informações copiadas!', 'success'));
    };

    document.getElementById('btnDownloadDocFromPreview').onclick = () => {
        downloadDocumentFile(doc);
    };

    modal.classList.add('active');
    safeCreateIcons();
}

function downloadDocumentFile(doc) {
    if (!doc.fileData || !doc.fileData.startsWith('data:')) {
        showToast('⚠️ Este documento ainda não possui um arquivo PDF real anexado. Clique em "Editar Documento" para subir o seu PDF original.', 'warning');
        return;
    }

    const a = document.createElement('a');
    a.href = doc.fileData;
    a.download = doc.fileName || `${(doc.title || 'Documento').replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`⬇️ Download do PDF original "${doc.fileName || doc.title}" concluído!`, 'success');
}

// Setup Drag & Drop Zone
const dropZone = document.getElementById('documentDropZone');
if (dropZone) {
    ['dragenter', 'dragover'].forEach(evtName => {
        dropZone.addEventListener(evtName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.style.borderColor = 'var(--color-primary)';
            dropZone.style.background = 'var(--color-primary-glow)';
        });
    });

    ['dragleave', 'drop'].forEach(evtName => {
        dropZone.addEventListener(evtName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.style.borderColor = 'var(--border-color)';
            dropZone.style.background = 'var(--bg-card)';
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                currentDocFile = {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    fileData: evt.target.result
                };
                openDocumentModal();
                const titleInput = document.getElementById('documentFormTitle');
                if (titleInput && !titleInput.value) {
                    titleInput.value = file.name.replace(/\.[^/.]+$/, "");
                }
                showToast(`📄 Arquivo "${file.name}" carregado! Preencha as informações para salvar.`, 'info');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Layout Switcher listeners
const layoutToggleBtns = document.querySelectorAll('#documentLayoutToggle .period-btn');
layoutToggleBtns.forEach(btn => {
    btn.onclick = () => {
        layoutToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        docActiveLayout = btn.getAttribute('data-doc-layout') || 'grid';
        renderDocuments();
    };
});

// Wire Upload Button
const btnUploadDoc = document.getElementById('btnUploadDocument');
if (btnUploadDoc) {
    btnUploadDoc.onclick = () => openDocumentModal();
}

// Wire Category Filters
const docCategoryFilters = document.querySelectorAll('#documentCategoryFilters li');
docCategoryFilters.forEach(li => {
    li.onclick = () => {
        docCategoryFilters.forEach(t => t.classList.remove('active'));
        li.classList.add('active');
        docActiveCategory = li.getAttribute('data-doc-category') || 'all';
        renderDocuments();
    };
});

// Wire Search Input
const docSearchInput = document.getElementById('documentSearchInput');
if (docSearchInput) {
    docSearchInput.oninput = (e) => {
        docSearchQuery = e.target.value;
        renderDocuments();
    };
}

// Wire Document File Input reader
const docFileInput = document.getElementById('documentFormFileInput');
if (docFileInput) {
    docFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                currentDocFile = {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    fileData: evt.target.result
                };
            };
            reader.readAsDataURL(file);
        }
    });
}

// Document Form submit
const documentForm = document.getElementById('documentForm');
if (documentForm) {
    documentForm.onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        if (!env.documents) env.documents = [];

        const id = document.getElementById('documentFormId').value;
        const title = document.getElementById('documentFormTitle').value.trim();
        const category = document.getElementById('documentFormCategory').value;
        const description = document.getElementById('documentFormDescription').value.trim();
        const tags = document.getElementById('documentFormTags').value.trim();

        if (id) {
            const existing = env.documents.find(d => d.id === id);
            if (existing) {
                existing.title = title;
                existing.category = category;
                existing.description = description;
                existing.tags = tags;
                if (currentDocFile) {
                    existing.fileName = currentDocFile.fileName;
                    existing.fileSize = currentDocFile.fileSize;
                    existing.fileType = currentDocFile.fileType;
                    existing.fileData = currentDocFile.fileData;
                }
                existing.updatedAt = new Date().toISOString();
                showToast('Documento atualizado com sucesso!', 'success');
            }
        } else {
            const newDoc = {
                id: 'doc_' + Date.now(),
                title,
                category,
                description,
                tags,
                fileName: currentDocFile ? currentDocFile.fileName : 'Documento.pdf',
                fileSize: currentDocFile ? currentDocFile.fileSize : 0,
                fileType: currentDocFile ? currentDocFile.fileType : 'application/pdf',
                fileData: currentDocFile ? currentDocFile.fileData : null,
                createdAt: new Date().toISOString()
            };
            env.documents.push(newDoc);
            showToast('Documento adicionado ao repositório!', 'success');
        }

        saveState();
        document.getElementById('documentModal').classList.remove('active');
        renderDocuments();
    };
}

window.renderDocuments = renderDocuments;

// ==========================================
// BULK ACTIONS & AGENT SYNC DIRECT HANDLERS
// ==========================================

// Function to update Bulk Toolbar Visibility
function updateContactsBulkBar() {
    const checkboxes = document.querySelectorAll('.contact-checkbox:checked');
    const bulkBar = document.getElementById('contactsBulkBar');
    const selectedCount = document.getElementById('bulkSelectedCount');
    
    if (checkboxes.length > 0) {
        bulkBar?.classList.remove('hidden');
        if (selectedCount) selectedCount.innerText = `${checkboxes.length} ${checkboxes.length === 1 ? 'contato selecionado' : 'contatos selecionados'}`;
    } else {
        bulkBar?.classList.add('hidden');
        const selectAll = document.getElementById('selectAllContacts');
        if (selectAll) selectAll.checked = false;
    }
}

// Wire Select All Contacts Checkbox
document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'selectAllContacts') {
        const isChecked = e.target.checked;
        const rowCheckboxes = document.querySelectorAll('.contact-checkbox');
        rowCheckboxes.forEach(cb => cb.checked = isChecked);
        updateContactsBulkBar();
    } else if (e.target && e.target.classList.contains('contact-checkbox')) {
        updateContactsBulkBar();
    }
});

// Helper to get array of selected contact IDs
function getSelectedContactIds() {
    const checkboxes = document.querySelectorAll('.contact-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.getAttribute('data-id')).filter(Boolean);
}

// 1. Bulk Apply Stage
const btnApplyBulkStage = document.getElementById('btnApplyBulkStage');
if (btnApplyBulkStage) {
    btnApplyBulkStage.onclick = () => {
        const ids = getSelectedContactIds();
        const newStage = document.getElementById('bulkStageSelect').value;
        if (ids.length === 0) return showToast('Nenhum contato selecionado.', 'warning');
        if (!newStage) return showToast('Selecione um estágio para aplicar.', 'warning');

        const env = getEnv();
        ids.forEach(id => {
            const contact = env.contacts.find(c => c.id === id);
            if (contact) {
                contact.status = newStage;
                if (!contact.timeline) contact.timeline = [];
                contact.timeline.push({
                    id: 'act_bulk_' + Date.now(),
                    type: 'note',
                    description: `Estágio alterado em massa para "${newStage}".`,
                    timestamp: new Date().toISOString()
                });
            }
        });

        saveState();
        renderContacts();
        if (typeof renderKanban === 'function') renderKanban();
        showToast(`✅ Estágio atualizado em ${ids.length} contatos!`, 'success');
        updateContactsBulkBar();
    };
}

// 2. Bulk Apply Niche
const btnApplyBulkNiche = document.getElementById('btnApplyBulkNiche');
if (btnApplyBulkNiche) {
    btnApplyBulkNiche.onclick = () => {
        const ids = getSelectedContactIds();
        const newNiche = document.getElementById('bulkNicheSelect').value;
        if (ids.length === 0) return showToast('Nenhum contato selecionado.', 'warning');
        if (!newNiche) return showToast('Selecione um nicho para aplicar.', 'warning');

        const env = getEnv();
        ids.forEach(id => {
            const contact = env.contacts.find(c => c.id === id);
            if (contact) {
                contact.niche = newNiche;
            }
        });

        saveState();
        renderContacts();
        showToast(`🏷️ Nicho "${newNiche}" aplicado em ${ids.length} contatos!`, 'success');
        updateContactsBulkBar();
    };
}

// 3. Bulk Apply Value
const btnApplyBulkValue = document.getElementById('btnApplyBulkValue');
if (btnApplyBulkValue) {
    btnApplyBulkValue.onclick = () => {
        const ids = getSelectedContactIds();
        const valInput = document.getElementById('bulkValueInput');
        const newValue = valInput ? parseFloat(valInput.value) : 0;
        if (ids.length === 0) return showToast('Nenhum contato selecionado.', 'warning');
        if (isNaN(newValue)) return showToast('Informe um valor numérico válido.', 'warning');

        const env = getEnv();
        ids.forEach(id => {
            const contact = env.contacts.find(c => c.id === id);
            if (contact) {
                contact.value = newValue;
            }
        });

        saveState();
        renderContacts();
        showToast(`💰 Valor R$ ${newValue.toFixed(2)} aplicado em ${ids.length} contatos!`, 'success');
        updateContactsBulkBar();
    };
}

// 4. Bulk Delete Contacts
const btnApplyBulkDelete = document.getElementById('btnApplyBulkDelete');
if (btnApplyBulkDelete) {
    btnApplyBulkDelete.onclick = () => {
        const ids = getSelectedContactIds();
        if (ids.length === 0) return showToast('Nenhum contato selecionado.', 'warning');

        if (confirm(`Tem certeza que deseja excluir ${ids.length} contatos selecionados?`)) {
            const env = getEnv();
            env.contacts = env.contacts.filter(c => !ids.includes(c.id));

            saveState();
            renderContacts();
            if (typeof renderKanban === 'function') renderKanban();
            showToast(`🗑️ ${ids.length} contatos excluídos!`, 'info');
            updateContactsBulkBar();
        }
    };
}

// 5. Button: Direct Pull Agent Leads Button
const btnPullAgentLeadsDirect = document.getElementById('btnPullAgentLeadsDirect');
if (btnPullAgentLeadsDirect) {
    btnPullAgentLeadsDirect.onclick = async () => {
        btnPullAgentLeadsDirect.disabled = true;
        showToast('🔄 Puxando leads do Agente Comercial...', 'info');

        try {
            const endpoint = typeof getApiUrl === 'function' ? getApiUrl('/api/sync-atendente-comercial') : '/api/sync-atendente-comercial';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (data.success) {
                showToast(`🎉 ${data.message}`, 'success');
                if (typeof loadState === 'function') await loadState();
                const envData = getEnv();
                if (envData && envData.contacts) {
                    envData.contacts = envData.contacts.filter(c => c.name !== 'Lead Agente' && c.company !== 'Lead Agente');
                }
                localStorage.removeItem("nexus_crm_state");
                renderContacts();
                if (typeof renderKanban === 'function') renderKanban();
                if (typeof renderDashboard === 'function') renderDashboard();
            } else {
                showToast(data.error || 'Erro ao sincronizar leads do Agente.', 'danger');
            }
        } catch (err) {
            console.error('Pull Agent Leads Error:', err);
            showToast('Erro de comunicação ao sincronizar leads.', 'danger');
        } finally {
            btnPullAgentLeadsDirect.disabled = false;
        }
    };
}


// Wire Search & Filter Input Listeners for Contacts Table Engine
const bindContactsEngineEvents = () => {
    const btnCards = document.getElementById('btnContactsViewCards');
    const btnTable = document.getElementById('btnContactsViewTable');

    if (btnCards && btnTable) {
        btnCards.onclick = () => {
            contactsTableState.viewMode = 'cards';
            btnCards.classList.add('active');
            btnCards.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: var(--bg-card); color: var(--color-primary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm);';
            btnTable.classList.remove('active');
            btnTable.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px;';
            renderContacts();
        };

        btnTable.onclick = () => {
            contactsTableState.viewMode = 'table';
            btnTable.classList.add('active');
            btnTable.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: var(--bg-card); color: var(--color-primary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm);';
            btnCards.classList.remove('active');
            btnCards.style.cssText = 'padding: 4px 10px; font-size: 11.5px; font-weight: 600; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-radius: 4px; display: flex; align-items: center; gap: 4px;';
            renderContacts();
        };
    }
    const searchInput = document.getElementById('contactsSearchInput');
    const globalSearchInput = document.getElementById('globalSearch');
    const nicheSelect = document.getElementById('contactsNicheFilter');
    const statusSelect = document.getElementById('filterStatus');
    const perPageSelect = document.getElementById('contactsPerPageSelect');

    const handleSearch = () => {
        contactsTableState.currentPage = 1;
        renderContacts();
    };

    if (searchInput) {
        searchInput.oninput = handleSearch;
        searchInput.onkeyup = handleSearch;
    }
    if (globalSearchInput) {
        globalSearchInput.oninput = handleSearch;
        globalSearchInput.onkeyup = handleSearch;
    }
    if (nicheSelect) {
        nicheSelect.onchange = handleSearch;
    }
    if (statusSelect) {
        statusSelect.onchange = handleSearch;
    }
    if (perPageSelect) {
        perPageSelect.onchange = handleSearch;
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindContactsEngineEvents);
} else {
    bindContactsEngineEvents();
}


// Automatic Background Polling for WhatsApp & Lead Sync Updates (Every 10 Minutes)
setInterval(() => {
    if (typeof loadState === 'function') {
        console.log('[CLIENT AUTO-POLL] Syncing state from server...');
        loadState().then(() => {
            if (typeof renderAll === 'function') renderAll();
        });
    }
}, 10 * 60 * 1000);

// ==========================================
// AFFILIATES MODULE ENGINE
// ==========================================
let affiliateSalesChartInstance = null;
let affiliateStatusChartInstance = null;
let affiliateSearchQuery = '';
let affiliateStatusFilter = 'all';

function renderAffiliates() {
    populateAffiliateDropdowns();

    const env = getEnv();
    const affiliates = getAffiliates();
    const contacts = env.contacts || [];

    // Calculations
    const totalAffiliates = affiliates.length;
    
    // Find all contacts tied to an affiliate
    const referredContacts = contacts.filter(c => c.affiliateId);
    const monthReferrals = referredContacts.length;

    // Total revenue generated by affiliates (from converted/won contacts or total contract value)
    let totalRevenueGenerated = 0;
    let totalCommissionsEarned = 0;
    let totalCommissionsPaid = 0;

    affiliates.forEach(aff => {
        const affLeads = contacts.filter(c => c.affiliateId === aff.id);
        const affRevenue = affLeads.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
        const affEarned = affRevenue * (Number(aff.commissionRate) / 100);
        const affPaid = (aff.payouts || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        aff._revenue = affRevenue;
        aff._earned = affEarned;
        aff._paid = affPaid;
        aff._pending = Math.max(0, affEarned - affPaid);
        aff._leadCount = affLeads.length;
        aff._wonCount = affLeads.filter(c => c.status === 'won').length;

        totalRevenueGenerated += affRevenue;
        totalCommissionsEarned += affEarned;
        totalCommissionsPaid += affPaid;
    });

    const pendingCommissions = Math.max(0, totalCommissionsEarned - totalCommissionsPaid);

    // Update KPI Ribbon
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('kpiTotalAffiliates', totalAffiliates);
    setEl('kpiMonthReferrals', monthReferrals);
    setEl('kpiAffiliateRevenue', formatCurrency(totalRevenueGenerated));
    setEl('kpiPendingCommissions', formatCurrency(pendingCommissions));

    // Render Charts
    renderAffiliateCharts(affiliates, totalCommissionsPaid, pendingCommissions);

    // Render Table
    const tbody = document.getElementById('affiliatesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let filtered = [...affiliates];

    if (affiliateStatusFilter === 'active') {
        filtered = filtered.filter(a => a.status === 'active');
    } else if (affiliateStatusFilter === 'pending') {
        filtered = filtered.filter(a => a._pending > 0);
    } else if (affiliateStatusFilter === 'paid') {
        filtered = filtered.filter(a => a._pending === 0 && a._paid > 0);
    }

    if (affiliateSearchQuery) {
        const q = affiliateSearchQuery.toLowerCase();
        filtered = filtered.filter(a => 
            (a.name || '').toLowerCase().includes(q) ||
            (a.code || '').toLowerCase().includes(q) ||
            (a.document || '').toLowerCase().includes(q) ||
            (a.pixKey || '').toLowerCase().includes(q)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: var(--text-muted);">Nenhum afiliado encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(aff => {
        const tr = document.createElement('tr');
        tr.style.cssText = "height: 52px; border-bottom: 1px solid var(--border-color);";
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="contact-avatar" style="width:34px; height:34px; font-size:11px; flex-shrink:0; background:linear-gradient(135deg, #4F46E5, #06B6D4); color:#fff; font-weight:700;">${getInitials(aff.name)}</div>
                    <div style="min-width:0; flex:1;">
                        <span style="font-weight:700; font-size:13px; color:var(--text-primary); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${aff.name}">${aff.name}</span>
                        <span style="font-size:11px; color:var(--text-muted);">${aff.email} • ${aff.phone}</span>
                    </div>
                </div>
            </td>
            <td>
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${aff.document}</span>
                    <span style="font-size:10.5px; color:var(--color-primary); font-family:monospace;" title="Chave Pix">🔑 ${aff.pixKey}</span>
                </div>
            </td>
            <td>
                <span style="display:inline-flex; align-items:center; gap:4px; font-family:monospace; font-size:12px; font-weight:700; background:rgba(79,70,229,0.1); color:#4F46E5; padding:3px 8px; border-radius:5px; border:1px solid rgba(79,70,229,0.2);">
                    🏷️ ${aff.code}
                </span>
            </td>
            <td style="text-align:center;">
                <span style="font-size:12.5px; font-weight:700; color:#06B6D4;">${aff.commissionRate}%</span>
            </td>
            <td style="text-align:center;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${aff._leadCount} leads</span>
                    <span style="font-size:10px; color:#059669; font-weight:600;">${aff._wonCount} fechados</span>
                </div>
            </td>
            <td>
                <strong style="font-size:13px; color:#059669;">${formatCurrency(aff._revenue)}</strong>
            </td>
            <td>
                <div style="display:flex; flex-direction:column;">
                    <span style="font-size:13px; font-weight:700; color:var(--text-primary);">${formatCurrency(aff._earned)}</span>
                    <span style="font-size:10.5px; color:${aff._pending > 0 ? '#d97706' : '#059669'}; font-weight:600;">
                        ${aff._pending > 0 ? `⏳ ${formatCurrency(aff._pending)} pendente` : `✅ Pago (${formatCurrency(aff._paid)})`}
                    </span>
                </div>
            </td>
            <td style="text-align:right;">
                <div style="display:inline-flex; gap:4px;">
                    <button class="btn-icon-only btn-payout-aff" data-id="${aff.id}" title="Lançar Pagamento Pix" style="color:#059669; background:rgba(5,150,105,0.1); border-radius:4px;"><i data-lucide="dollar-sign" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-edit-aff" data-id="${aff.id}" title="Editar Afiliado"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                    <button class="btn-icon-only btn-delete-aff" data-id="${aff.id}" title="Excluir Afiliado" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                </div>
            </td>
        `;

        tr.querySelector('.btn-payout-aff').onclick = () => openAffiliatePayoutModal(aff.id);
        tr.querySelector('.btn-edit-aff').onclick = () => openAffiliateModal(aff.id);
        tr.querySelector('.btn-delete-aff').onclick = () => deleteAffiliate(aff.id);

        tbody.appendChild(tr);
    });

    safeCreateIcons();
}

function renderAffiliateCharts(affiliates, totalPaid, totalPending) {
    if (typeof Chart === 'undefined') return;

    // 1. Sales Bar Chart
    const ctxSales = document.getElementById('affiliateSalesChart');
    if (ctxSales) {
        if (affiliateSalesChartInstance) affiliateSalesChartInstance.destroy();
        
        const topAffiliates = [...affiliates].sort((a, b) => b._revenue - a._revenue).slice(0, 6);
        const labels = topAffiliates.map(a => a.name.split(' ')[0] + ' (' + a.code + ')');
        const dataValues = topAffiliates.map(a => a._revenue);

        affiliateSalesChartInstance = new Chart(ctxSales, {
            type: 'bar',
            data: {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [{
                    label: 'Faturamento Gerado (R$)',
                    data: dataValues.length > 0 ? dataValues : [0],
                    backgroundColor: 'rgba(79, 70, 229, 0.75)',
                    borderColor: '#4F46E5',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: (v) => formatCurrency(v) } }
                }
            }
        });
    }

    // 2. Status Doughnut Chart
    const ctxStatus = document.getElementById('affiliateStatusChart');
    if (ctxStatus) {
        if (affiliateStatusChartInstance) affiliateStatusChartInstance.destroy();

        affiliateStatusChartInstance = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Comissões Pagas', 'Comissões Pendentes'],
                datasets: [{
                    data: [totalPaid, totalPending],
                    backgroundColor: ['#059669', '#d97706'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

function openAffiliateModal(id = null) {
    const affiliates = getAffiliates();
    const aff = id ? affiliates.find(a => a.id === id) : null;

    document.getElementById('affiliateFormId').value = aff ? aff.id : '';
    document.getElementById('affiliateName').value = aff ? aff.name : '';
    document.getElementById('affiliateCode').value = aff ? aff.code : '';
    document.getElementById('affiliateEmail').value = aff ? aff.email : '';
    document.getElementById('affiliatePhone').value = aff ? aff.phone : '';
    document.getElementById('affiliateDocument').value = aff ? aff.document : '';
    document.getElementById('affiliateCommissionRate').value = aff ? aff.commissionRate : '3';
    document.getElementById('affiliatePixKey').value = aff ? aff.pixKey : '';
    document.getElementById('affiliateBankInfo').value = aff ? (aff.bankInfo || '') : '';
    document.getElementById('affiliateDiscountBenefit').value = aff ? (aff.discountBenefit || '') : '10% de desconto na hospedagem ou 1º mês grátis';
    
    document.getElementById('affiliateModalTitle').innerText = aff ? 'Editar Afiliado' : 'Novo Afiliado';

    const close = () => document.getElementById('affiliateModal').classList.remove('active');
    document.getElementById('btnCloseAffiliateModal').onclick = close;
    document.getElementById('btnCancelAffiliateModal').onclick = close;

    document.getElementById('affiliateModal').classList.add('active');
}

function deleteAffiliate(id) {
    const env = getEnv();
    const aff = (env.affiliates || []).find(a => a.id === id);
    if (!aff) return;

    if (confirm(`Excluir o afiliado "${aff.name}" (${aff.code})?`)) {
        env.affiliates = env.affiliates.filter(a => a.id !== id);
        
        // Remove referral link from contacts tied to this affiliate
        (env.contacts || []).forEach(c => {
            if (c.affiliateId === id) delete c.affiliateId;
        });

        saveState();
        renderAffiliates();
        showToast('Afiliado removido com sucesso!', 'info');
    }
}

function openAffiliatePayoutModal(id) {
    const affiliates = getAffiliates();
    const aff = affiliates.find(a => a.id === id);
    if (!aff) return;

    document.getElementById('payoutAffiliateId').value = aff.id;
    document.getElementById('payoutAffiliateName').innerText = aff.name;
    document.getElementById('payoutPixKey').innerText = `Pix: ${aff.pixKey}`;
    document.getElementById('payoutAmount').value = aff._pending > 0 ? aff._pending.toFixed(2) : '0.00';
    document.getElementById('payoutReceipt').value = '';

    const close = () => document.getElementById('affiliatePayoutModal').classList.remove('active');
    document.getElementById('btnClosePayoutModal').onclick = close;
    document.getElementById('btnCancelPayoutModal').onclick = close;

    document.getElementById('affiliatePayoutModal').classList.add('active');
}


// Wire Affiliate Form Submits & Toolbar Listeners
const affiliateForm = document.getElementById('affiliateForm');
if (affiliateForm) {
    affiliateForm.onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        if (!env.affiliates) env.affiliates = [];

        const id = document.getElementById('affiliateFormId').value;
        const name = document.getElementById('affiliateName').value.trim();
        const code = document.getElementById('affiliateCode').value.trim().toUpperCase();
        const email = document.getElementById('affiliateEmail').value.trim();
        const phone = document.getElementById('affiliatePhone').value.trim();
        const documentVal = document.getElementById('affiliateDocument').value.trim();
        const commissionRate = parseFloat(document.getElementById('affiliateCommissionRate').value) || 3.0;
        const pixKey = document.getElementById('affiliatePixKey').value.trim();
        const bankInfo = document.getElementById('affiliateBankInfo').value.trim();
        const discountBenefit = document.getElementById('affiliateDiscountBenefit').value.trim();

        if (id) {
            const existing = env.affiliates.find(a => a.id === id);
            if (existing) {
                existing.name = name;
                existing.code = code;
                existing.email = email;
                existing.phone = phone;
                existing.document = documentVal;
                existing.commissionRate = commissionRate;
                existing.pixKey = pixKey;
                existing.bankInfo = bankInfo;
                existing.discountBenefit = discountBenefit;
                showToast('Afiliado atualizado com sucesso!', 'success');
            }
        } else {
            const newAff = {
                id: 'aff_' + Date.now(),
                name,
                code,
                email,
                phone,
                document: documentVal,
                commissionRate,
                pixKey,
                bankInfo,
                discountBenefit,
                status: 'active',
                createdAt: new Date().toISOString(),
                payouts: []
            };
            env.affiliates.push(newAff);
            showToast('Novo afiliado cadastrado!', 'success');
        }

        saveState();
        document.getElementById('affiliateModal').classList.remove('active');
        renderAffiliates();
    };
}

const affiliatePayoutForm = document.getElementById('affiliatePayoutForm');
if (affiliatePayoutForm) {
    affiliatePayoutForm.onsubmit = (e) => {
        e.preventDefault();
        const env = getEnv();
        const id = document.getElementById('payoutAffiliateId').value;
        const amount = parseFloat(document.getElementById('payoutAmount').value) || 0;
        const receipt = document.getElementById('payoutReceipt').value.trim();

        const aff = (env.affiliates || []).find(a => a.id === id);
        if (aff && amount > 0) {
            if (!aff.payouts) aff.payouts = [];
            aff.payouts.push({
                id: 'pay_' + Date.now(),
                amount,
                date: new Date().toISOString(),
                receipt: receipt || 'Transferência Pix'
            });

            saveState();
            showToast(`💰 Pagamento Pix de ${formatCurrency(amount)} registrado para ${aff.name}!`, 'success');
            document.getElementById('affiliatePayoutModal').classList.remove('active');
            renderAffiliates();
        }
    };
}

// Wire Toolbar Listeners for Affiliates
const btnAddAffiliate = document.getElementById('btnAddAffiliate');
if (btnAddAffiliate) btnAddAffiliate.onclick = () => openAffiliateModal();

const btnOpenAffiliateLinkGenerator = document.getElementById('btnOpenAffiliateLinkGenerator');
if (btnOpenAffiliateLinkGenerator) {
    btnOpenAffiliateLinkGenerator.onclick = () => {
        const affiliates = getAffiliates();
        if (affiliates.length === 0) return showToast('Cadastre ao menos um afiliado primeiro.', 'warning');
        const code = affiliates[0].code;
        const url = `https://webcolabs.com.br/?ref=${code}`;
        prompt('Link de Afiliado Gerado:', url);
    };
}

const filterAffStatus = document.getElementById('filterAffiliateStatus');
if (filterAffStatus) {
    filterAffStatus.onchange = (e) => {
        affiliateStatusFilter = e.target.value;
        renderAffiliates();
    };
}

const affSearch = document.getElementById('affiliatesSearchInput');
if (affSearch) {
    affSearch.oninput = (e) => {
        affiliateSearchQuery = e.target.value;
        renderAffiliates();
    };
}

