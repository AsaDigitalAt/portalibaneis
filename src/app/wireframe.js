export const rawHTML = `

<h1>Wireframe – Portal Ibaneis Rocha</h1>
<p class="subtitle">Estrutura do portal · candidato ao Senado · clique nas abas para navegar</p>

<div class="nav-tabs">
  <button class="nav-tab active" onclick="show('home',this)">Home</button>
  <button class="nav-tab" onclick="show('noticias',this)">Notícias</button>
  <button class="nav-tab" onclick="show('artigo',this)">Matéria (interna)</button>
  <button class="nav-tab" onclick="show('posts',this)">Posts rápidos</button>
  <button class="nav-tab" onclick="show('entregas',this)">Entregas (BI)</button>
  <button class="nav-tab" onclick="show('palavra',this)">Palavra do Dia</button>
  <button class="nav-tab" onclick="show('sobre',this)">Sobre Ibaneis</button>
</div>

<!-- ===================== HOME ===================== -->
<div class="page active" id="page-home">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br</div></div>
    <div>
      <div class="topbar">
        <div class="logo">
          <div class="logo-circle">IR</div>
          <div>
            <div class="sk-d" style="width:100px;height:9px;margin-bottom:4px"></div>
            <div class="sk" style="width:70px;height:6px"></div>
          </div>
        </div>
        <div class="nav-links">
          <div class="nav-link ap">Home</div>
          <div class="nav-link">Notícias</div>
          <div class="nav-link">Posts</div>
          <div class="nav-link">Entregas</div>
          <div class="nav-link">Fotos</div>
          <div class="nav-link">Vídeos</div>
          <div class="nav-link">Palavra do Dia</div>
          <div class="nav-link">Sobre Ibaneis</div>
        </div>
      </div>

      <!-- Hero -->
      <div class="hero">
        <div>
          <div style="font-size:11px; font-weight:700; color:#555; text-transform:uppercase; margin-bottom:8px;">Uma gestão de ações e resultados</div>
          <div style="font-size:24px; font-weight:800; color:#1a1a18; line-height:1.1; margin-bottom:14px;">+ DE 7 MIL OBRAS FEITAS<br>EM TODO O DF!</div>
          <div style="font-size:12px; color:#555; margin-bottom:16px;">Com foco na integração entre as áreas e expansão econômica, entregamos resultados reais.</div>
          <div style="display:flex;gap:8px">
            <button onclick="show('entregas', document.querySelectorAll('.nav-tab')[4])" style="cursor:pointer; border:none; background:#1a1a18; color:#fff; width:110px; height:28px; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600;">Ver entregas</button>
            <button style="cursor:pointer; background:#e8e7e2; color:#333; width:120px; height:28px; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600; border:1px solid #ddd;">Busca de Dados (IA)</button>
          </div>
        </div>
        <div style="height:115px; border-radius:10px; position:relative; background:url('https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.FOTO.BURITI.jpg?alt=media&token=ab1e2c2e-194d-48b5-bafa-0d12e43eb703') center/cover;">
        </div>
      </div>

      <!-- Métricas KPIs Rápidas em Destaque -->
      <div class="section" style="padding-top:20px; padding-bottom:20px; background:#fafaf7; border-bottom:1px solid #e5e4df;">
        <div class="g4">
          <div class="metric-card" style="border:1px solid #e0e0e0; background:#fff; text-align:center; padding:12px; border-radius:8px; box-shadow:0 2px 6px rgba(0,39,89,0.03);">
            <div style="font-size:18px; font-weight:900; color:#0278F8; margin-bottom:2px;">7.000+</div>
            <div style="font-size:8px;color:#777;text-transform:uppercase;font-weight:700;">Total de entregas</div>
          </div>
          <div class="metric-card" style="border:1px solid #e0e0e0; background:#fff; text-align:center; padding:12px; border-radius:8px; box-shadow:0 2px 6px rgba(0,39,89,0.03);">
            <div style="font-size:18px; font-weight:900; color:#0278F8; margin-bottom:2px;">35</div>
            <div style="font-size:8px;color:#777;text-transform:uppercase;font-weight:700;">Cidades atendidas</div>
          </div>
          <div class="metric-card" style="border:1px solid #e0e0e0; background:#fff; text-align:center; padding:12px; border-radius:8px; box-shadow:0 2px 6px rgba(0,39,89,0.03);">
            <div style="font-size:18px; font-weight:900; color:#0278F8; margin-bottom:2px;">100%</div>
            <div style="font-size:8px;color:#777;text-transform:uppercase;font-weight:700;">Áreas cobertas</div>
          </div>
          <div class="metric-card" style="border:1px solid #e0e0e0; background:#fff; text-align:center; padding:12px; border-radius:8px; box-shadow:0 2px 6px rgba(0,39,89,0.03);">
            <div style="font-size:18px; font-weight:900; color:#0278F8; margin-bottom:2px;">44,9 bi</div>
            <div style="font-size:8px;color:#777;text-transform:uppercase;font-weight:700;">Valor investido</div>
          </div>
        </div>
      </div>

      <!-- Palavra do Dia (destaque) -->
      <div class="section" style="background:#fafaf7">
        <div class="section-label">Palavra do dia</div>
        <div style="display:grid;grid-template-columns:36px 1fr;gap:12px;align-items:start">
          <div class="post-avatar" style="width:36px;height:36px; background:url('https://placehold.co/36x36/ccc/999?text=O') center/cover;"></div>
          <div>
            <div style="font-size:12px; font-weight:500; color:#1a1a18; margin-bottom:5px; line-height:1.4;">- Respondei-me pelo vosso imenso amor, neste tempo favorável, Senhor Deus.</div>
            <div style="font-size:10px; color:#777; margin-bottom:10px; font-style:italic;">Responsório Sl 68(69),8-10.21bcd-22.31 e 33-34 (R. 14cb)</div>
            <div style="display:flex;gap:10px;align-items:center">
              <a href="#" style="text-decoration:none; padding:4px 10px; border:1px solid #ddd; background:#fff; border-radius:4px; font-size:9px; color:#444; display:flex; align-items:center; gap:5px;"><div class="share-icon" style="width:12px;height:12px;border-radius:2px;background:#bbb;"></div> Compartilhe essa mensagem!</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Matérias destaque + Posts rápidos -->
      <div class="section">
        <div class="g2" style="gap:16px">
          <div>
            <div class="section-label">Notícias em destaque</div>
            <div class="g3" id="noticias-destaque" style="margin-bottom:8px">
              <div class="card">
                <a href="https://www.agenciabrasilia.df.gov.br/w/tempo-de-espera-de-pacientes-oncologicos-na-rede-publica-de-saude-no-df-e-reduzido-em-80-" target="_blank" style="text-decoration:none; color:inherit;">
                  <div class="card-thumb" style="position:relative; background:#e8e7e2;"><div class="ann" style="bottom:4px;left:4px;position:absolute">Foto</div></div>
                  <div class="card-body">
                    <div class="tag">Saúde</div>
                    <div style="font-size:10px; font-weight:600; line-height:1.3; color:#333;">Tempo de espera de pacientes oncológicos na rede pública é reduzido em 80%</div>
                  </div>
                </a>
              </div>
              <div class="card">
                <a href="https://www.agenciabrasilia.df.gov.br/w/educacao-publica-do-df-reduz-fila-de-creches-e-leva-alunos-ao-exterior-em-2025" target="_blank" style="text-decoration:none; color:inherit;">
                  <div class="card-thumb" style="background:#e8e7e2;"></div>
                  <div class="card-body">
                    <div class="tag">Educação</div>
                    <div style="font-size:10px; font-weight:600; line-height:1.3; color:#333;">Educação pública reduz fila de creches e leva alunos ao exterior</div>
                  </div>
                </a>
              </div>
              <div class="card">
                <a href="https://www.agenciabrasilia.df.gov.br/w/gdf-investiu-r-74-milhoes-em-recuperacao-de-quase-10-mil-km-de-estradas-rurais-nos-ultimos-anos?redirect=%2Fnoticias%2F" target="_blank" style="text-decoration:none; color:inherit;">
                  <div class="card-thumb" style="background:#e8e7e2;"></div>
                  <div class="card-body">
                    <div class="tag">Infraestrutura</div>
                    <div style="font-size:10px; font-weight:600; line-height:1.3; color:#333;">GDF investiu R\$ 74 mi na recuperação de estradas rurais</div>
                  </div>
                </a>
              </div>
            </div>
            <div style="text-align:right"><button onclick="show('noticias', document.querySelectorAll('.nav-tab')[1])" style="background:none;border:none;cursor:pointer;font-size:9px;color:#555;font-weight:600;">Ver mais notícias →</button></div>
          </div>
          <div>
            <div class="section-label">Posts rápidos recentes</div>
            <div style="display:flex;flex-direction:column;gap:7px">
              <a href="https://www.instagram.com/p/DWeSotRRhZs/" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="post-rapido">
                  <div class="post-rapido-header">
                    <div class="post-avatar" style="background:url('https://placehold.co/26x26/ccc/999?text=I') center/cover;"></div>
                    <div><div style="font-size:10px;font-weight:600;color:#222;">Ibaneis Rocha</div><div style="font-size:8px;color:#777;">Instagram</div></div>
                  </div>
                  <div class="post-rapido-body">
                    <div style="font-size:10px;color:#444;line-height:1.4;">Mais entregas na região do DF! Confira nosso último resumo com imagens de obras sendo concluídas.</div>
                  </div>
                </div>
              </a>
              <a href="https://www.instagram.com/p/DWW5NzBkWGV/?img_index=1" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="post-rapido">
                  <div class="post-rapido-header">
                    <div class="post-avatar" style="background:url('https://placehold.co/26x26/ccc/999?text=I') center/cover;"></div>
                    <div><div style="font-size:10px;font-weight:600;color:#222;">Ibaneis Rocha</div><div style="font-size:8px;color:#777;">Instagram</div></div>
                  </div>
                  <div class="post-rapido-body">
                    <div style="font-size:10px;color:#444;line-height:1.4;">Finalizamos uma fase importante de investimentos. Obrigado a todos os envolvidos no processo.</div>
                  </div>
                </div>
              </a>
              <div style="text-align:right"><button onclick="show('posts', document.querySelectorAll('.nav-tab')[3])" style="background:none;border:none;cursor:pointer;font-size:9px;color:#555;font-weight:600;">Ver mais posts →</button></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Entregas resumo + Vídeos -->
      <div class="section">
        <div class="g2" style="gap:16px">
          <div>
            <div class="section-label">Entregas em destaque</div>
            <div style="display:flex;flex-direction:column;gap:6px" id="entregas-destaque">
              <a href="https://www.agenciabrasilia.df.gov.br/w/saude-investiu-mais-de-meio-bilhao-de-reais-na-infraestrutura-em-2025" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="entrega-card"><div class="tag">Saúde</div><div style="font-size:11px;font-weight:600;color:#222;line-height:1.2;margin:4px 0;">Saúde investiu mais de meio bilhão na infraestrutura</div><div class="city-row"><div class="city-dot"></div><span style="font-size:9px;color:#777;">Todo o DF</span></div></div>
              </a>
              <a href="https://www.agenciabrasilia.df.gov.br/w/educacao-publica-do-df-reduz-fila-de-creches-e-leva-alunos-ao-exterior-em-2025" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="entrega-card"><div class="tag">Educação</div><div style="font-size:11px;font-weight:600;color:#222;line-height:1.2;margin:4px 0;">Redução de fila de creches e alunos ao exterior</div><div class="city-row"><div class="city-dot"></div><span style="font-size:9px;color:#777;">Diversas regiões</span></div></div>
              </a>
              <a href="https://www.agenciabrasilia.df.gov.br/w/df-ultrapassa-150-km-de-novas-ciclovias-e-acelera-rumo-a-lideranca-nacional" target="_blank" style="text-decoration:none; color:inherit;">
                <div class="entrega-card"><div class="tag">Mobilidade</div><div style="font-size:11px;font-weight:600;color:#222;line-height:1.2;margin:4px 0;">DF ultrapassa 150 km de novas ciclovias</div><div class="city-row"><div class="city-dot"></div><span style="font-size:9px;color:#777;">Plano Piloto / Entorno</span></div></div>
              </a>
              <div style="text-align:right"><button onclick="show('entregas', document.querySelectorAll('.nav-tab')[4])" style="background:none;border:none;cursor:pointer;font-size:9px;color:#555;font-weight:600;">Ver BI completo →</button></div>
            </div>
          </div>
          <div>
            <div class="section-label">Vídeos mais recentes</div>
            <a href="https://youtube.com/watch?placeholder" target="_blank" style="text-decoration:none; color:inherit;">
              <div class="embed-box" style="height:120px;margin-bottom:8px;position:relative;background:#333;border:none;">
                <div class="play"></div>
                <div class="ann" style="bottom:5px;right:5px;position:absolute">Despedida (7 min)</div>
              </div>
            </a>
            <div class="g2">
              <div class="card"><div class="card-thumb" style="height:36px;background:#e8e7e2;"></div><div class="card-body" style="padding:5px 8px"><div style="font-size:9px;font-weight:600;">Obras 2025</div></div></div>
              <div class="card"><div class="card-thumb" style="height:36px;background:#e8e7e2;"></div><div class="card-body" style="padding:5px 8px"><div style="font-size:9px;font-weight:600;">Pronunciamento</div></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Galeria Flickr -->
      <div class="section">
        <div class="section-label">Galeria de fotos (Flickr)</div>
        <div class="g4">
          <div class="sk" style="height:60px;border-radius:6px"></div>
          <div class="sk" style="height:60px;border-radius:6px"></div>
          <div class="sk" style="height:60px;border-radius:6px"></div>
          <div class="sk-d" style="height:60px;border-radius:6px;display:flex;align-items:center;justify-content:center"><span style="font-size:9px;color:#666">Ver todas →</span></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div><div class="sk-d" style="height:8px;width:80px;margin-bottom:7px"></div><div class="sk-d" style="height:6px;width:95%;margin-bottom:4px"></div><div class="sk-d" style="height:6px;width:80%"></div></div>
        <div><div class="sk-d" style="height:8px;width:60px;margin-bottom:7px"></div><div class="sk-d" style="height:6px;width:85%;margin-bottom:4px"></div><div class="sk-d" style="height:6px;width:70%"></div></div>
        <div><div class="sk-d" style="height:8px;width:70px;margin-bottom:7px"></div><div class="sk-d" style="height:6px;width:80%;margin-bottom:4px"></div><div class="sk-d" style="height:6px;width:65%"></div></div>
        <div><div class="sk-d" style="height:8px;width:65px;margin-bottom:7px"></div><div style="display:flex;gap:6px;margin-top:4px"><div class="share-icon"></div><div class="share-icon"></div><div class="share-icon"></div><div class="share-icon"></div></div></div>
      </div>
    </div>
  </div>
</div>

<!-- ===================== NOTÍCIAS ===================== -->
<div class="page" id="page-noticias">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br/noticias</div></div>
    <div>
      <div class="topbar">
        <div class="logo"><div class="logo-circle">IR</div></div>
        <div class="nav-links">
          <div class="nav-link">Home</div><div class="nav-link ap">Notícias</div><div class="nav-link">Posts</div><div class="nav-link">Entregas</div><div class="nav-link">Fotos</div><div class="nav-link">Vídeos</div><div class="nav-link">Palavra do Dia</div><div class="nav-link">Sobre</div>
        </div>
      </div>
      <div class="section">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px" id="noticias-filtros">
          <div class="tag" style="padding:4px 12px;font-size:10px;background:#e0dfd9">Todas</div>
          <div class="tag" style="padding:4px 12px;font-size:10px">Saúde</div>
          <div class="tag" style="padding:4px 12px;font-size:10px">Educação</div>
          <div class="tag" style="padding:4px 12px;font-size:10px">Infraestrutura</div>
          <div class="tag" style="padding:4px 12px;font-size:10px">Segurança</div>
          <div class="tag" style="padding:4px 12px;font-size:10px">Economia</div>
          <div class="tag" style="padding:4px 12px;font-size:10px">Meio Ambiente</div>
        </div>
        <a href="https://www.agenciabrasilia.df.gov.br/w/ibaneis-tem-segundo-retrato-incluido-na-galeria-dos-governadores-do-df" target="_blank" style="text-decoration:none; color:inherit; display:block;" id="noticias-destaque-hero">
          <div class="card" style="display:grid;grid-template-columns:190px 1fr;margin-bottom:12px">
            <div style="background:url('https://placehold.co/190x110/e8e7e2/999?text=Gov') center/cover; min-height:110px; border-radius:7px 0 0 7px; position:relative"><div class="ann" style="bottom:6px;left:6px;position:absolute">Foto oficial</div></div>
            <div style="padding:14px">
              <div class="tag">Destaque</div>
              <div style="font-size:16px; font-weight:800; line-height:1.2; color:#1a1a18; margin-bottom:8px;">Ibaneis tem segundo retrato incluído na galeria dos governadores do DF</div>
              <div style="font-size:11px; color:#555; line-height:1.4;">Mais um registro de sua passagem pelo governo inserido na história do Distrito Federal.</div>
            </div>
          </div>
        </a>
        <div class="g3" style="margin-bottom:8px" id="noticias-lista">
          <a href="https://www.agenciabrasilia.df.gov.br/w/governador-ibaneis-rocha-nomeia-1.154-profissionais-para-reforcar-a-rede-publica-de-saude" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="background:#e8e7e2;"></div><div class="card-body"><div class="tag">Saúde</div><div style="font-size:10px; font-weight:600; line-height:1.3;">Governador nomeia 1.154 profissionais para a rede pública</div></div></a>
          <a href="https://www.agenciabrasilia.df.gov.br/w/undf-ganha-novo-campus-em-ceilandia-e-amplia-oferta-de-ensino-superior-publico-na-capital" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="background:#e8e7e2;"></div><div class="card-body"><div class="tag">Educação</div><div style="font-size:10px; font-weight:600; line-height:1.3;">UnDF ganha novo campus em Ceilândia e amplia ensino superior</div></div></a>
          <a href="https://www.agenciabrasilia.df.gov.br/w/gdf-conclui-obras-de-infraestrutura-no-n%C3%BAcleo-rural-sobradinho-no-itapo%C3%A3-com-investimento-de-r-32-milh%C3%B5es" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="background:#e8e7e2;"></div><div class="card-body"><div class="tag">Infraestrutura</div><div style="font-size:10px; font-weight:600; line-height:1.3;">Obras de infraestrutura concluídas em núcleo rural de Sobradinho</div></div></a>
        </div>
        <div class="g3">
          <a href="https://www.agenciabrasilia.df.gov.br/w/gdf-entrega-167-novas-viaturas-para-reforcar-fiscalizacao-e-servicos-do-detran-df" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="background:#e8e7e2;"></div><div class="card-body"><div class="tag">Segurança</div><div style="font-size:10px; font-weight:600; line-height:1.3;">GDF entrega 167 viaturas para reforçar serviços do Detran</div></div></a>
          <a href="https://www.agenciabrasilia.df.gov.br/w/melhor-para-viver-e-empreender-brasilia-se-destaca-no-apoio-a-empresarios" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="background:#e8e7e2;"></div><div class="card-body"><div class="tag">Economia</div><div style="font-size:10px; font-weight:600; line-height:1.3;">Melhor para viver: Brasília se destaca no apoio a empresários</div></div></a>
          <a href="https://www.agenciabrasilia.df.gov.br/w/sancionado-novo-pdot-atualiza-planejamento-urbano-do-df-para-os-proximos-dez-anos" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="background:#e8e7e2;"></div><div class="card-body"><div class="tag">Meio Ambiente</div><div style="font-size:10px; font-weight:600; line-height:1.3;">Sancionado novo PDOT: atualiza planejamento urbano do DF</div></div></a>
        </div>
        <div class="pagination">
          <div class="pg ap">1</div><div class="pg">2</div><div class="pg">3</div><div class="pg">4</div><div class="pg">→</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===================== MATÉRIA INTERNA ===================== -->
<div class="page" id="page-artigo">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br/noticias/titulo-da-materia</div></div>
    <div>
      <div class="topbar">
        <div class="logo"><div class="logo-circle">IR</div></div>
        <div class="nav-links">
          <div class="nav-link">Home</div><div class="nav-link ap">Notícias</div><div class="nav-link">Posts</div><div class="nav-link">Entregas</div><div class="nav-link">Fotos</div><div class="nav-link">Vídeos</div><div class="nav-link">Palavra do Dia</div><div class="nav-link">Sobre</div>
        </div>
      </div>
      <div class="section">
        <div class="breadcrumb">
          <div class="sk" style="height:6px;width:30px"></div>
          <span style="font-size:9px;color:#aaa">›</span>
          <div class="sk" style="height:6px;width:55px"></div>
          <span style="font-size:9px;color:#aaa">›</span>
          <div class="sk-d" style="height:6px;width:95px"></div>
        </div>
        <div class="g-art">
          <div>
            <div class="tag" style="margin-bottom:10px">Notícia - Destaque</div>
            <div style="font-size:20px; font-weight:800; color:#1a1a18; line-height:1.2; margin-bottom:14px;">Ibaneis tem segundo retrato incluído na galeria dos governadores do DF</div>
            <div style="font-size:12px; color:#555; line-height:1.5; margin-bottom:14px;">Após a cerimônia de encerramento da jornada e transição para a campanha ao Senado Federal, o legado de ações e obras realizadas no DF ganham lugar de destaque na galeria.</div>
            <div style="position:relative;margin-bottom:10px">
              <div class="embed-box" style="height:140px; background:#e8e7e2; border:none;">
                <div class="play"></div>
                <span style="font-size:9px;color:#999">Cerimônia completa</span>
              </div>
            </div>
            <div style="font-size:8px;color:#aaa;text-align:center;margin-bottom:14px">Cerimônia de Descerramento - Foto: Arquivo</div>
            <div style="font-size:12px; color:#555; line-height:1.5; margin-bottom:16px;">Políticos e população do Distrito Federal acompanham de perto os melhores momentos de toda a gestão.</div>
            <div class="section-label">Fotos relacionadas (Flickr)</div>
            <div style="position:relative;margin-bottom:14px">
              <div class="g4"><div class="sk" style="height:44px;border-radius:5px"></div><div class="sk" style="height:44px;border-radius:5px"></div><div class="sk" style="height:44px;border-radius:5px"></div><div class="sk" style="height:44px;border-radius:5px"></div></div>
              <div class="ann" style="bottom:4px;right:0;position:absolute">galeria Flickr embed</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
              <span style="font-size:9px;color:#aaa">Tags:</span>
              <div class="chip">#saúde</div><div class="chip">#DF</div><div class="chip">#hospital</div>
            </div>
            <div class="share-row">
              <div class="share-icons"><div class="share-icon"></div><div class="share-icon"></div><div class="share-icon"></div></div>
              <div class="sk" style="height:7px;width:90px"></div>
            </div>
          </div>
          <div>
            <div class="section-label">Mais matérias</div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
              <a href="https://www.agenciabrasilia.df.gov.br/w/undf-ganha-novo-campus-em-ceilandia-e-amplia-oferta-de-ensino-superior-publico-na-capital" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="height:40px;background:#e8e7e2;"></div><div class="card-body" style="padding:6px 8px"><div class="tag">Educação</div><div style="font-size:9px;font-weight:600;line-height:1.3;margin-top:2px;">UnDF ganha novo campus em Ceilândia</div></div></a>
              <a href="https://www.agenciabrasilia.df.gov.br/w/gdf-conclui-obras-de-infraestrutura-no-n%C3%BAcleo-rural-sobradinho-no-itapo%C3%A3-com-investimento-de-r-32-milh%C3%B5es" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="height:40px;background:#e8e7e2;"></div><div class="card-body" style="padding:6px 8px"><div class="tag">Infraestrutura</div><div style="font-size:9px;font-weight:600;line-height:1.3;margin-top:2px;">Obras de infra concluídas em núcleo rural</div></div></a>
              <a href="https://www.agenciabrasilia.df.gov.br/w/gdf-entrega-167-novas-viaturas-para-reforcar-fiscalizacao-e-servicos-do-detran-df" target="_blank" style="text-decoration:none; color:inherit;" class="card"><div class="card-thumb" style="height:40px;background:#e8e7e2;"></div><div class="card-body" style="padding:6px 8px"><div class="tag">Segurança</div><div style="font-size:9px;font-weight:600;line-height:1.3;margin-top:2px;">Novas viaturas reforçam o Detran</div></div></a>
            </div>
            <div class="section-label">Vídeo relacionado</div>
            <div class="embed-box" style="height:72px;border-radius:6px"><div class="play" style="width:18px;height:18px"></div><span style="font-size:8px;color:#aaa">YouTube</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===================== POSTS RÁPIDOS ===================== -->
<div class="page" id="page-posts">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br/posts</div></div>
    <div>
      <div class="topbar">
        <div class="logo"><div class="logo-circle">IR</div></div>
        <div class="nav-links">
          <div class="nav-link">Home</div><div class="nav-link">Notícias</div><div class="nav-link ap">Posts</div><div class="nav-link">Entregas</div><div class="nav-link">Fotos</div><div class="nav-link">Vídeos</div><div class="nav-link">Palavra do Dia</div><div class="nav-link">Sobre</div>
        </div>
      </div>
      <div class="section">
        <div style="max-width:520px;margin:0 auto">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
            <div class="tag" style="padding:4px 12px;font-size:10px;background:#e0dfd9">Todos</div>
            <div class="tag" style="padding:4px 12px;font-size:10px">Política</div>
            <div class="tag" style="padding:4px 12px;font-size:10px">Brasília</div>
            <div class="tag" style="padding:4px 12px;font-size:10px">Senado</div>
            <div class="tag" style="padding:4px 12px;font-size:10px">Educação</div>
          </div>

          <!-- Post 1 (com imagem) -->
          <a href="https://noticias.r7.com/brasilia/ibaneis-assina-renuncia-ao-governo-do-df-para-concorrer-ao-senado-28032026/" target="_blank" style="text-decoration:none; color:inherit; display:block; margin-bottom:10px;">
            <div class="post-rapido">
              <div class="post-rapido-header">
                <div class="post-avatar" style="background:url('https://placehold.co/26x26/e8e7e2/999?text=R7') center/cover;"></div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:#222;">Portal R7</div>
                  <div style="font-size:8px;color:#777;">Notícias - Brasília</div>
                </div>
              </div>
              <div style="height:110px;background:url('https://placehold.co/520x110/e8e7e2/999?text=Assinatura') center/cover;position:relative">
                <div class="ann" style="bottom:6px;left:6px;position:absolute">Foto da matéria</div>
              </div>
              <div class="post-rapido-body" style="padding-bottom:14px;">
                <div style="font-size:12px;font-weight:600;color:#1a1a18;margin-bottom:6px;line-height:1.2;">Ibaneis assina renúncia ao Governo do DF para concorrer ao Senado</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Decisão oficializa saída para a disputa das eleições deste ano.</div>
              </div>
            </div>
          </a>

          <!-- Post 2 (só texto) -->
          <a href="https://gpsbrasilia.com.br/ibaneis-carteira-oab-candidatura-senado/" target="_blank" style="text-decoration:none; color:inherit; display:block; margin-bottom:10px;">
            <div class="post-rapido">
              <div class="post-rapido-header">
                <div class="post-avatar" style="background:url('https://placehold.co/26x26/e8e7e2/999?text=GPS') center/cover;"></div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:#222;">GPS Brasília</div>
                  <div style="font-size:8px;color:#777;">Política</div>
                </div>
              </div>
              <div class="post-rapido-body" style="padding-bottom:14px;">
                <div style="font-size:12px;font-weight:600;color:#1a1a18;margin-bottom:6px;line-height:1.2;">Em ato simbólico, Ibaneis recebe carteira da OAB e confirma candidatura ao Senado</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Antes de iniciar o governo, a OAB foi palco de suas primeiras gestões estruturadas.</div>
              </div>
            </div>
          </a>

          <!-- Post 3 (só texto) -->
          <a href="https://www.metropoles.com/colunas/grande-angular/ibaneis-diz-que-deixa-gdf-com-sensacao-de-missao-cumprida-fala-sobre-eleicoes-e-crise-do-brb" target="_blank" style="text-decoration:none; color:inherit; display:block; margin-bottom:10px;">
            <div class="post-rapido">
              <div class="post-rapido-header">
                <div class="post-avatar" style="background:url('https://placehold.co/26x26/e8e7e2/999?text=Met') center/cover;"></div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:#222;">Metrópoles</div>
                  <div style="font-size:8px;color:#777;">Grande Angular</div>
                </div>
              </div>
              <div class="post-rapido-body" style="padding-bottom:14px;">
                <div style="font-size:12px;font-weight:600;color:#1a1a18;margin-bottom:6px;line-height:1.2;">"Missão cumprida", diz Ibaneis ao deixar GDF</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Governador fala sobre as eleições, balanço da gestão e perspectivas para o futuro.</div>
              </div>
            </div>
          </a>

          <div class="pagination">
            <div class="pg ap">1</div><div class="pg">2</div><div class="pg">3</div><div class="pg">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===================== ENTREGAS BI ===================== -->
<div class="page" id="page-entregas">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br/entregas</div></div>
    <div>
      <div class="topbar">
        <div class="logo"><div class="logo-circle">IR</div></div>
        <div class="nav-links">
          <div class="nav-link">Home</div><div class="nav-link">Notícias</div><div class="nav-link">Posts</div><div class="nav-link ap">Entregas</div><div class="nav-link">Fotos</div><div class="nav-link">Vídeos</div><div class="nav-link">Palavra do Dia</div><div class="nav-link">Sobre</div>
        </div>
      </div>
      <div class="section" id="bi-section">
        <!-- This whole section is replaced by React -->
        <div class="sk-d" style="height:14px;width:140px;margin-bottom:6px"></div>
        <div class="sk" style="height:7px;width:220px"></div>
      </div>
    </div>
  </div>
</div>


<!-- ===================== PALAVRA DO DIA ===================== -->
<div class="page" id="page-palavra">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br/palavra-do-dia</div></div>
    <div>
      <div class="topbar">
        <div class="logo"><div class="logo-circle">IR</div></div>
        <div class="nav-links">
          <div class="nav-link">Home</div><div class="nav-link">Notícias</div><div class="nav-link">Posts</div><div class="nav-link">Entregas</div><div class="nav-link">Fotos</div><div class="nav-link">Vídeos</div><div class="nav-link ap">Palavra do Dia</div><div class="nav-link">Sobre</div>
        </div>
      </div>
      <div class="section">
        <div style="max-width:500px;margin:0 auto">

          <!-- Mensagem de hoje -->
          <div style="font-size:9px;color:#aaa;text-align:center;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Mensagem de hoje · <span style="color:#bbb">1 de abril de 2026</span></div>
          <div class="palavra-card" style="margin-bottom:20px">
            <div class="palavra-header">
              <div class="palavra-avatar" style="background:url('https://placehold.co/40x40/ccc/999?text=Iba') center/cover;"></div>
              <div>
                <div style="font-size:12px;font-weight:700;color:#222;margin-bottom:2px;">Ibaneis Rocha</div>
                <div style="font-size:9px;color:#777;">Reflexão diária</div>
              </div>
              <div style="margin-left:auto"><div class="tag" style="font-size:9px;padding:3px 8px">Hoje</div></div>
            </div>
            <div class="palavra-body">
              <div style="font-size:14px; font-weight:500; color:#1a1a18; margin-bottom:10px; line-height:1.5;">- Respondei-me pelo vosso imenso amor, neste tempo favorável, Senhor Deus.</div>
              <div style="font-size:10px; color:#666; font-style:italic;">Responsório Sl 68(69),8-10.21bcd-22.31 e 33-34 (R. 14cb)</div>
            </div>
            <div class="palavra-footer">
              <div style="display:flex;gap:8px">
                <div class="share-icon" style="width:30px;height:30px; border-radius:50%; background:#e8e7e2; display:flex; align-items:center; justify-content:center; font-size:12px;">IG</div>
                <div class="share-icon" style="width:30px;height:30px; border-radius:50%; background:#e8e7e2; display:flex; align-items:center; justify-content:center; font-size:12px;">X</div>
              </div>
              <a href="#" style="text-decoration:none; background:#eee; padding:6px 12px; border-radius:5px; font-size:9px; color:#444; font-weight:600;">Compartilhar</a>
            </div>
          </div>

          <!-- Mensagens anteriores -->
          <div class="section-label">Mensagens anteriores</div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div class="post-rapido">
              <div class="post-rapido-header" style="justify-content:space-between; display:flex;">
                <div style="font-size:10px;font-weight:700;color:#555;">31 de março de 2026</div><div class="tag">Ontem</div>
              </div>
              <div class="post-rapido-body" style="padding-bottom:14px;">
                <div style="font-size:12px; font-weight:500; color:#1a1a18; margin-bottom:6px;">- O cálice por nós abençoado é a nossa comunhão com o sangue do Senhor.</div>
                <div style="font-size:9px; color:#888; font-style:italic;">Responsório Sl 115(116B)</div>
              </div>
            </div>
            <div class="post-rapido">
              <div class="post-rapido-header" style="justify-content:space-between; display:flex;">
                <div style="font-size:10px;font-weight:700;color:#555;">30 de março de 2026</div><div class="tag">Segunda</div>
              </div>
              <div class="post-rapido-body" style="padding-bottom:14px;">
                <div style="font-size:12px; font-weight:500; color:#1a1a18; margin-bottom:6px;">- Ó Pai, em tuas mãos eu entrego o meu espírito.</div>
                <div style="font-size:9px; color:#888; font-style:italic;">Responsório Sl 30(31)</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===================== SOBRE IBANEIS ===================== -->
<div class="page" id="page-sobre">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br/sobre</div></div>
    <div>
      <div class="topbar">
        <div class="logo"><div class="logo-circle">IR</div></div>
        <div class="nav-links">
          <div class="nav-link">Home</div><div class="nav-link">Notícias</div><div class="nav-link">Posts</div><div class="nav-link">Entregas</div><div class="nav-link">Fotos</div><div class="nav-link">Vídeos</div><div class="nav-link">Palavra do Dia</div><div class="nav-link ap">Sobre</div>
        </div>
      </div>

      <!-- Hero Sobre -->
      <div class="sobre-hero">
        <div class="sobre-foto" style="background:url('https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.FOTO.BURITI.jpg?alt=media&token=ab1e2c2e-194d-48b5-bafa-0d12e43eb703') center/cover;"></div>
        <div>
          <div style="font-size:28px; font-weight:800; color:#ffffff; margin-bottom:12px;">Conheça um pouco mais sobre mim</div>
          <div style="font-size:15px; color:#f0f0f0; line-height:1.6;">Assumimos o DF em 2019 com desafios e transformamos projetos em resultados concretos. Avançamos na modernização da cidade, com grandes obras e expansão de programas sociais que chegaram a quem mais precisa. O resultado é uma gestão marcada por políticas públicas que melhoraram a vida da população.</div>
        </div>
      </div>

      <div class="section">
        <div class="g-art">
          <div>
            <!-- Bio -->
            <div class="section-label">Minha trajetória</div>
            <div style="font-size:12px; color:#444; line-height:1.6; margin-bottom:20px;">
              Sou advogado nascido em Brasília, e tive a honra de ser o primeiro brasiliense a governar o Distrito Federal. Fui eleito em 2018 e reeleito em 2022, cumprindo dois mandatos à frente do DF entre 2019 e 2026, sempre com o compromisso de trabalhar pela população e mudar a nossa capital.
            </div>

            <!-- Timeline -->
            <div class="section-label">Linha do tempo</div>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-year">1971</div>
                <div style="font-size:11px;font-weight:600;color:#222;margin-bottom:2px;">Nasci em Brasília</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">No Hospital de Base, filho de pais piauienses.</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-year">Anos 1980 / 1990</div>
                <div style="font-size:11px;font-weight:600;color:#222;margin-bottom:2px;">Estudos e Advocacia</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Voltei a Brasília, me formei em Direito pelo UniCeub, e abri meu escritório.</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-year">2013-2015</div>
                <div style="font-size:11px;font-weight:600;color:#222;margin-bottom:2px;">OAB-DF</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Tive a honra de presidir a OAB-DF.</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-year">2018</div>
                <div style="font-size:11px;font-weight:600;color:#222;margin-bottom:2px;">Eleito Governador</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Após 25 anos na advocacia, assumi o Governo do DF.</div>
              </div>
              <div class="timeline-item" style="margin-bottom:0">
                <div class="timeline-dot" style="background:#555"></div>
                <div class="timeline-year" style="color:#555">2026</div>
                <div style="font-size:11px;font-weight:600;color:#222;margin-bottom:2px;">Fim de ciclo no GDF</div>
                <div style="font-size:10px;color:#555;line-height:1.4;">Encerro meu mandato com a missão cumprida.</div>
              </div>
            </div>
          </div>

          <!-- Sidebar sobre -->
          <div>
            <div class="section-label">Dados</div>
            <div style="border:1px solid #e5e4df;border-radius:7px;overflow:hidden;margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #eee"><div class="sk" style="height:6px;width:55px"></div><div class="sk-d" style="height:6px;width:65px"></div></div>
              <div style="display:flex;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #eee"><div class="sk" style="height:6px;width:45px"></div><div class="sk-d" style="height:6px;width:70px"></div></div>
              <div style="display:flex;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #eee"><div class="sk" style="height:6px;width:60px"></div><div class="sk-d" style="height:6px;width:55px"></div></div>
              <div style="display:flex;justify-content:space-between;padding:8px 10px"><div class="sk" style="height:6px;width:50px"></div><div class="sk-d" style="height:6px;width:80px"></div></div>
            </div>

            <div class="section-label">Redes sociais</div>
            <div style="display:flex;gap:6px;margin-bottom:16px">
              <div class="share-icon" style="width:32px;height:32px;border-radius:8px"></div>
              <div class="share-icon" style="width:32px;height:32px;border-radius:8px"></div>
              <div class="share-icon" style="width:32px;height:32px;border-radius:8px"></div>
              <div class="share-icon" style="width:32px;height:32px;border-radius:8px"></div>
            </div>

            <div class="section-label">Principais realizações</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <div style="padding:6px;background:#f7f6f2;border-radius:4px;font-size:10px;color:#444;font-weight:600;">13 escolas</div>
              <div style="padding:6px;background:#f7f6f2;border-radius:4px;font-size:10px;color:#444;font-weight:600;">11 viadutos</div>
              <div style="padding:6px;background:#f7f6f2;border-radius:4px;font-size:10px;color:#444;font-weight:600;">7 Upas</div>
              <div style="padding:6px;background:#f7f6f2;border-radius:4px;font-size:10px;color:#444;font-weight:600;">Túnel de Taguatinga</div>
              <div style="padding:6px;background:#f7f6f2;border-radius:4px;font-size:10px;color:#444;font-weight:600;">14 mil moradias</div>
              <div style="padding:6px;background:#f7f6f2;border-radius:4px;font-size:10px;color:#444;font-weight:600;">RenovaDF</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  `;
