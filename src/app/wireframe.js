export const rawHTML = `

<h1>Wireframe – Portal Ibaneis Rocha</h1>
<p class="subtitle">Estrutura do portal · candidato ao Senado · clique nas abas para navegar</p>

<div class="nav-tabs">
  <button class="nav-tab active" onclick="show('home',this)">Home</button>
  <button class="nav-tab" onclick="show('noticias',this)">Notícias</button>
  <button class="nav-tab" onclick="show('artigo',this)">Matéria (interna)</button>
  <button class="nav-tab" onclick="show('posts',this)">Posts</button>
  <button class="nav-tab" onclick="show('entregas',this)">Entregas (BI)</button>
  <button class="nav-tab" onclick="show('palavra',this)">Palavra do Dia</button>
  <button class="nav-tab" onclick="show('sobre',this)">Sobre Ibaneis</button>
</div>

<!-- ===================== HOME ===================== -->
<div class="page active" id="page-home">
  <div class="browser">
    <div class="browser-bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="url-bar">ibaneis.com.br</div></div>
    <div>
      <div class="header-clean">
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

      <!-- Novo Hero Banner -->
      <div class="hero-banner" style="overflow: hidden;">
        <img src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FBanner%20home.png?alt=media&token=eae3b654-1e74-49d1-baca-b3a5484aa492" alt="Gestão Ibaneis" style="width:100%; height:auto; display:block;" />
        <button class="chevron-down-btn" onClick="show('entregas', document.querySelectorAll('.nav-tab')[4])" style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); z-index: 10;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      <!-- Palavra do Dia Flex -->
      <div class="home-section" style="background: #ffffff;">
        <div class="palavra-home">
          <div class="palavra-home-left">
            PALAVRA<br><span>do dia</span>
          </div>
          <div class="palavra-home-card">
            - Respondei-me pelo vosso imenso amor, neste tempo favorável, Senhor Deus.<br><br>
            <span style="font-size: 11px; color:#777; font-weight: 300;">Responsório Sl 68(69),8-10.21bcd-22.31 e 33-34 (R. 14cb)</span>
            <button class="palavra-home-btn">Compartilhe essa mensagem! <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3l7 7-7 7v-4h-2c-3.31 0-6 2.69-6 6v1H4v-1c0-4.96 4.04-9 9-9h1V3z"/></svg></button>
          </div>
        </div>
      </div>

      <!-- Notícias + Instagram Flex -->
      <div class="section-gray">
         <div class="noticias-ig-flex">
            <!-- Esquerda: Notícias -->
            <div class="noticias-grid" id="noticias-destaque">
               <div class="news-landscape" style="background-image: url('https://placehold.co/400x200');">
                 <div class="blue-pill">Destaque</div>
                 <div class="news-overlay">Carregando dados da Agência Brasília...</div>
               </div>
            </div>

            <!-- Direita: Instagram IG -->
            <div class="ig-carousel">
               <button class="nav-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
               <div class="ig-cards" id="ig-posts-destaque">
                  <div class="ig-vertical"><div class="ig-vertical-thumb" style="background-image:url('https://placehold.co/140x200')"></div><div class="ig-vertical-autor"><div class="ig-avatar"></div><div class="ig-nome">IbaneisOficial</div></div><div class="ig-text">Carregando posts...</div></div>
               </div>
               <button class="nav-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
            </div>
         </div>
      </div>

      <!-- Entregas e Vídeos -->
      <div class="home-section" style="background:#fff">
          <div class="entregas-grid">
               <!-- Esquerda: Cards Dark Blue -->
               <div class="entregas-left" id="entregas-destaque">
                   <div class="entrega-dark-card">
                       <div class="entrega-dark-img" style="background-image: url('https://placehold.co/200x120');"></div>
                       <div class="entrega-dark-text"><div class="entrega-dark-pill">Destaque</div><br>Carregando BI...</div>
                   </div>
               </div>

               <!-- Direita: Vídeos Grid -->
               <div class="entregas-right" id="video-destaque-container">
                   <div class="video-main" style="background-image:url('https://placehold.co/600x300'); background-size:cover;">
                       <div class="play-btn-huge"><div class="play-yellow"></div></div>
                   </div>
                   <div class="video-grid">
                       <div class="video-small" style="background-image:url('https://placehold.co/300x150'); background-size:cover;">
                            <div class="play-btn-small"><div class="play-yellow-small"></div></div>
                       </div>
                       <div class="video-small" style="background-image:url('https://placehold.co/300x150'); background-size:cover;">
                            <div class="play-btn-small"><div class="play-yellow-small"></div></div>
                       </div>
                   </div>
               </div>
          </div>
      </div>

      <!-- Galeria Fotos Masonry -->
      <div class="home-section" style="background: #ffffff; border-top: 1px solid #eee;">
          <div class="galeria-header">ACOMPANHE NOSSA GALERIA DE FOTOS</div>
          <div class="galeria-flex">
              <button class="nav-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
              <div class="masonry">
                  <div class="ms-item ms-hero" style="background-image: url('https://www.agenciabrasilia.df.gov.br/wp-content/uploads/2021/04/1A7A7831-2.jpg');"></div>
                  <div class="ms-item" style="background-image: url('https://www.agenciabrasilia.df.gov.br/wp-content/uploads/2023/11/17.11.23-INAUGURACAO-RESTAURANTE-COMUNITARIO-ARNOIQUE-MARCOS-OLIVEIRA-AGENCIA-BRASILIA-08-3.jpg');"></div>
                  <div class="ms-item" style="background-image: url('https://www.agenciabrasilia.df.gov.br/wp-content/uploads/2023/04/FOTO-MARIO-MOITA-78.jpg');"></div>
                  <div class="ms-item" style="background-image: url('https://www.agenciabrasilia.df.gov.br/wp-content/uploads/2022/01/IMG_0185.jpg');"></div>
                  <div class="ms-item" style="background-image: url('https://www.agenciabrasilia.df.gov.br/wp-content/uploads/2021/08/10.08.21-governador-ibaneis-rocha-visita-restaurante-comunitario12.jpg');"></div>
              </div>
              <button class="nav-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
          </div>
          <button class="veja-todas-btn" onclick="show('fotos', document.querySelectorAll('.nav-tab')[5])">Veja todas</button>
      </div>

      <!-- Footer Novo -->
      <div class="footer-novo">
         <div class="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
         </div>
         <div id="footer-social-block" style="display:flex; flex-direction:column; align-items:flex-end;">
            <div style="font-size:10px; margin-bottom:8px;">Siga nossas redes sociais</div>
            <div class="footer-social">
               <div class="social-icn">IG</div><div class="social-icn">FB</div><div class="social-icn">YT</div>
            </div>
         </div>
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
      <div class="news-redesign-wrapper">
        <div class="news-redesign-container"></div>
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
      <div class="posts-redesign-wrapper">
        <div class="posts-redesign-container"></div>
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
      <div class="palavra-redesign-wrapper">
        <div class="palavra-redesign-container"></div>
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

      <div class="sobre-redesign-wrapper">
        <div class="sobre-redesign-container"></div>
      </div>
    </div>
  </div>
</div>

  `;
