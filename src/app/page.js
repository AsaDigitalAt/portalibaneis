"use client";
import parse, { domToReact } from 'html-react-parser';
import { useState, useEffect } from 'react';
import { rawHTML } from './wireframe.js';
import AIChatWidget from '@/components/AIChatWidget';

// Mock de Base de Dados para Palavra do Dia
const PALAVRAS_DUMMY = [
  { id: 1, dateLabel: "hoje", date: "1 de abril de 2026", title: "Mensagem de hoje", ref: "Responsório Sl 68(69),8-10.21bcd-22.31 e 33-34 (R. 14cb)", text: "- Respondei-me pelo vosso imenso amor, neste tempo favorável, Senhor Deus." },
  { id: 2, dateLabel: "ontem", date: "31 de março de 2026", title: "Mensagem de ontem", ref: "Responsório Sl 115(116B),12-13.15-16bc.17-18 (R. cf. 1Cor 10,16)", text: "- O cálice por nós abençoado é a nossa comunhão com o sangue do Senhor." },
  { id: 3, dateLabel: "segunda", date: "30 de março de 2026", title: "Mensagem de segunda", ref: "Responsório Sl 30(31),2.6.12-13.15-16.17.25 (R. Lc 23,46)", text: "- Ó Pai, em tuas mãos eu entrego o meu espírito." },
  { id: 4, dateLabel: "domingo", date: "29 de março de 2026", title: "Mensagem de domingo", ref: "Responsório Sl 21(22),8-9.17-18a.19-20.23-24 (R. 2a)", text: "- Meu Deus, meu Deus, por que me abandonastes?" },
  { id: 5, dateLabel: "sábado", date: "28 de março de 2026", title: "Mensagem de sábado", ref: "Responsório Jeremias 31,10.11-12ab.13 (R. cf. 10d)", text: "- O Senhor nos guardará qual pastor a seu rebanho." },
  { id: 6, dateLabel: "sexta", date: "27 de março de 2026", title: "Mensagem de sexta", ref: "Responsório Sl 17(18),2-3a.3bc-4.5-6.7 (R. cf. 7)", text: "- Ao Senhor eu invoquei na minha angústia e elevei o meu clamor." },
  { id: 7, dateLabel: "quinta", date: "26 de março de 2026", title: "Mensagem de quinta", ref: "Responsório Sl 104(105),4-5.6-7.8-9 (R. 4a)", text: "- Buscai constantemente a face do Senhor!" },
  { id: 8, dateLabel: "quarta", date: "25 de março de 2026", title: "Mensagem de quarta", ref: "Responsório Is 7,10-14; 8,10", text: "- Eis que a Virgem conceberá e dará à luz um filho." },
  { id: 9, dateLabel: "terça", date: "24 de março de 2026", title: "Mensagem de terça", ref: "Responsório Sl 101(102),2-3.16-18.19-21 (R. 2)", text: "- Senhor, ouvi a minha oração, e o meu clamor chegue até vós!" }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [igPosts, setIgPosts] = useState([]);
  const [igStartIndex, setIgStartIndex] = useState(0);
  const [mostrarMaisVideos, setMostrarMaisVideos] = useState(false);
  
  // Estados de Notícias
  const [noticias, setNoticias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [newsPage, setNewsPage] = useState(1);
  const [palavraPage, setPalavraPage] = useState(1);

  // Estados de Posts
  const [postsFilter, setPostsFilter] = useState('Todos');
  const [postsPage, setPostsPage] = useState(1);

  // Estados de Entregas BI
  const [entregas, setEntregas] = useState([]);
  const [biFilterArea, setBiFilterArea] = useState('Todas');
  const [biFilterRegiao, setBiFilterRegiao] = useState('Todas');
  const [biFilterPeriodo, setBiFilterPeriodo] = useState('Todos');
  const [biVisibleCards, setBiVisibleCards] = useState(18);

  // Bateria de imagens reais pr-selecionadas do site da Agencia (para Notícias e Entregas)
  const realMedia = {
    noticias: [
      "https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.FOTO.BURITI.jpg?alt=media&token=ab1e2c2e-194d-48b5-bafa-0d12e43eb703",
      "https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2Fibaneis%20foto%20de%20perfil.jpg?alt=media&token=f60d6e27-701e-48db-a907-0be7749a8dd4",
      "https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.FOTO.BURITI.jpg?alt=media&token=ab1e2c2e-194d-48b5-bafa-0d12e43eb703"
    ]
  };
  let newsIdx = 0;
  let igIdx = 0;

  useEffect(() => {
    // Buscar vídeos fresquinhos da API da Apify!
    fetch('/api/youtube')
      .then(r => r.json())
      .then(d => {
         if(d.videos && d.videos.length > 0) {
            const sorted = [...d.videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setVideos(sorted.slice(0, 10)); // Armazenar até 10 para o 'Ver mais'
         } else {
            // Vídeos reais do canal da Agência Brasília - 2019 a 2026
            setVideos([
              { url: 'https://www.youtube.com/watch?v=Zf8CbDNTDJI', title: 'UBS, UPA, creche, moradia, um viaduto e muito mais para o Riacho Fundo II', duration: '3:22' },
              { url: 'https://www.youtube.com/watch?v=EfOF47DavOU', title: 'Programa da Ceasa transforma desperdício em alimento na mesa de famílias', duration: '4:10' },
              { url: 'https://www.youtube.com/watch?v=VIGzkw5KuCM', title: 'Lei que facilita acesso ao crédito para mulheres empreendedoras do DF é sancionada', duration: '5:15' },
              { url: 'https://www.youtube.com/watch?v=Kjc5NIUykmw', title: 'Com investimento de R$ 1,3 milhão, Hran ganha cozinha hospitalar adequada', duration: '3:45' },
              { url: 'https://www.youtube.com/watch?v=bmoyJmj46JQ', title: 'A inauguração da Escola da Natureza comandou a transformação do Núcleo Bandeirante', duration: '4:02' },
              { url: 'https://www.youtube.com/watch?v=9s-YSOZeMXw', title: 'Tradicional Via Sacra no Morro da Capelinha reúne milhares de fiéis em Planaltina', duration: '3:58' },
            ]);
         }
      })
      .catch((e) => console.log('Apify Youtube not scraped yet', e));

    // Buscar últimos posts do Instagram via Apify
    fetch('/api/instagram')
      .then(r => r.json())
      .then(d => {
         if(d.posts && d.posts.length > 0) {
            const valid = d.posts.filter(p => !p.ownerUsername || p.ownerUsername.toLowerCase() === 'ibaneisoficial');
            const sorted = valid.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            if (sorted.length > 0) {
              setIgPosts(sorted); // Agora enviaremos tudo (limite 10 pelo actor) para preencher o carrossel.
            } else {
              throw new Error("No ibaneis apify data");
            }
         } else {
            throw new Error("No apify data");
         }
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do Instagram:", err);
      });

    fetch('/api/noticias')
      .then(r => r.json())
      .then(d => {
         if(d.noticias && d.noticias.length > 0) {
            setNoticias(d.noticias);
         }
      })
      .catch((e) => console.log('API Noticias error', e));

    fetch('/api/entregas')
      .then(r => r.json())
      .then(d => { if(d.entregas) setEntregas(d.entregas); })
      .catch(e => console.log('API Entregas error', e));
  }, []);

  const options = {
    replace: (domNode) => {
      // 1. Omitir elementos do Wireframe falso
      if (domNode.name === 'h1' || (domNode.attribs && domNode.attribs.class === 'subtitle')) return <></>;
      if (domNode.attribs && domNode.attribs.class === 'nav-tabs') return <></>; 
      if (domNode.attribs && domNode.attribs.class === 'browser-bar') return <></>; 
      // Suprimir footer skeleton do wireframe (substituído pelo footer real de redes sociais)
      if (domNode.attribs && (domNode.attribs.class === 'footer' || domNode.attribs.class === 'footer-novo')) return <></>;
      
      // 2. Transpirar shell
      if (domNode.attribs && domNode.attribs.class === 'browser') {
        return <div style={{width:'100%', minHeight:'100vh'}}>{domToReact(domNode.children, options)}</div>;
      }

      // 2.5 Interceptar Hero Banner da Home para adicionar botões clicáveis dinâmicos no React
      if (domNode.attribs && domNode.attribs.class === 'hero-banner') {
         return (
             <div className="hero-banner" style={{position: 'relative', overflow: 'hidden'}}>
                 <img src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FBanner%20home.png?alt=media&token=eae3b654-1e74-49d1-baca-b3a5484aa492" alt="Gestão Ibaneis" style={{width:'100%', height:'auto', display:'block'}} />
                 {/* Botão invisível sobreposto ao texto 'Ver entregas' da arte geométrica! Mapeamento responsivo via % */}
                 <button 
                     onClick={() => setActiveTab('entregas')}
                     title="Acessar Entregas"
                     style={{
                         position: 'absolute', 
                         top: '75%', 
                         left: '11%', 
                         width: '26%', 
                         height: '15%', 
                         background: 'transparent', 
                         border: 'none', 
                         cursor: 'pointer', 
                         zIndex: 20
                     }}
                 />
                 {/* Chevron Button original */}
                 <button className="chevron-down-btn" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})} style={{position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background:'transparent', border:'none', color:'#fff', cursor:'pointer'}}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
                 </button>
             </div>
         );
      }

      // 3. Ativar o Menu Principal
      // 3. Substituir Links da Barra de Navegação
      if (domNode.attribs && domNode.attribs.class === 'nav-links' || domNode.attribs && domNode.attribs.class === 'header-nav') {
        const tabs = [
          { id: 'home', label: 'Home' },
          { id: 'noticias', label: 'Notícias' },
          { id: 'posts', label: 'Posts Rápidos' },
          { id: 'entregas', label: 'Entregas' },
          { id: 'palavra', label: 'Palavra do Dia' },
          { id: 'sobre', label: 'Sobre Ibaneis' }
        ];
         return (
          <div className="header-nav">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`header-link ${activeTab === tab.id ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
         );
      }

      // 3.5. Substituir a Logo
      if (domNode.attribs && domNode.attribs.class === 'logo') {
         return (
           <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
             <img 
               src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FLOGO%20IBANEIS%20variacoes_BRANCA.AZUL%20ESCURO.png?alt=media&token=2c0c1b73-225e-4ec2-bec1-4ca8cacd4a00" 
               alt="Ibaneis Rocha"
             />
           </div>
         );
      }

      // 4. Injetar Miniaturas Visuais OFICIAIS nas molduras neutras (.card-thumb)
      if (domNode.attribs && domNode.attribs.class === 'card-thumb') {
         // Cíclamos pela matriz de imagens da Agência
         const currentImg = realMedia.noticias[newsIdx % realMedia.noticias.length];
         newsIdx++;
         return (
            <div className="card-thumb" style={{
               backgroundImage: `url(${currentImg})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
            }}>
               {domToReact(domNode.children, options)}
            </div>
         );
      }

      // 5. Renderizar Instagram dinâmico no formato de carrossel (.ig-carousel)
      if (domNode.attribs && domNode.attribs.class === 'ig-carousel') {
         if (igPosts.length > 0) {
             const maxIndex = Math.max(0, igPosts.length - 3);
             const handlePrev = () => setIgStartIndex(s => Math.max(0, s - 1));
             const handleNext = () => setIgStartIndex(s => Math.min(maxIndex, s + 1));
             
             return (
                 <div className="ig-carousel">
                     <button className="nav-arrow" onClick={handlePrev} disabled={igStartIndex === 0} style={{ opacity: igStartIndex === 0 ? 0.3 : 1, cursor: igStartIndex === 0 ? 'not-allowed' : 'pointer' }}>
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                     </button>
                     <div className="ig-cards" id="ig-posts-destaque">
                         {igPosts.slice(igStartIndex, igStartIndex + 3).map((post, idx) => {
                             const rawThumb = post.displayUrl || post.thumbnail;
                             const thumb = rawThumb ? `/api/ig-image?url=${encodeURIComponent(rawThumb)}` : 'https://placehold.co/140x200';
                             return (
                             <a href={post.url} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}} key={idx}>
                                 <div className="ig-vertical">
                                     <div className="ig-vertical-thumb" style={{
                                         backgroundImage: `url(${thumb})`
                                     }}></div>
                                     <div className="ig-vertical-autor">
                                         <img src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2Fibaneis%20foto%20de%20perfil.jpg?alt=media&token=f60d6e27-701e-48db-a907-0be7749a8dd4" alt="Ibaneis Rocha" style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
                                         <div className="ig-nome">IbaneisOficial</div>
                                     </div>
                                     <div className="ig-text">
                                         {post.caption?.substring(0, 80)}{post.caption?.length > 80 ? '...' : ''}
                                     </div>
                                 </div>
                             </a>
                             );
                         })}
                     </div>
                     <button className="nav-arrow" onClick={handleNext} disabled={igStartIndex >= maxIndex} style={{ opacity: igStartIndex >= maxIndex ? 0.3 : 1, cursor: igStartIndex >= maxIndex ? 'not-allowed' : 'pointer' }}>
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     </button>
                 </div>
             );
         }
      }

      // 5.1 Renderizar YouTube vídeos dinâmicos no Home
      if (domNode.attribs && domNode.attribs.id === 'video-destaque-container') {
         if (videos.length >= 3) {
             const vMain = videos[0];
             const vSide1 = videos[1];
             const vSide2 = videos[2];

             const getBg = (v) => v.domain === 'youtube.com' || v.url?.includes('youtube') 
                ? `url(https://img.youtube.com/vi/${v.url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg)`
                : `url(https://placehold.co/600x300)`;

             return (
                 <div className="entregas-right" id="video-destaque-container">
                     <a href={vMain.url} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
                         <div className="video-main" style={{ backgroundImage: getBg(vMain), backgroundSize: 'cover', backgroundPosition: 'center' }}>
                             <div className="play-btn-huge"><div className="play-yellow"></div></div>
                             <div className="news-overlay" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}}>{vMain.title}</div>
                         </div>
                     </a>
                     <div className="video-grid">
                         <a href={vSide1.url} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
                             <div className="video-small" style={{ backgroundImage: getBg(vSide1), backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                  <div className="play-btn-small"><div className="play-yellow-small"></div></div>
                             </div>
                         </a>
                         <a href={vSide2.url} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
                             <div className="video-small" style={{ backgroundImage: getBg(vSide2), backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                  <div className="play-btn-small"><div className="play-yellow-small"></div></div>
                             </div>
                         </a>
                     </div>
                 </div>
             )
         }
      }

      // 5.5 Renderizar noticias dinâmicas (HOME)
      if (domNode.attribs && domNode.attribs.id === 'noticias-destaque') {
          if (noticias.length > 0) {
              return (
                  <div className="noticias-grid" id="noticias-destaque">
                      {noticias.slice(0, 4).map((noticia, idx) => {
                          const bgImage = noticia.img || realMedia.noticias[idx % realMedia.noticias.length];
                          const noticiaLink = noticia.link === 'https://www.agenciabrasilia.df.gov.br/' 
                              ? `https://www.agenciabrasilia.df.gov.br/?s=${encodeURIComponent(noticia.text || noticia.title)}` 
                              : noticia.link;
                          return (
                          <a href={noticiaLink} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}} key={idx}>
                              <div className="news-landscape" style={{
                                  backgroundImage: `url(${bgImage})`
                              }}>
                                  <div className="blue-pill">{noticia.area || noticia.tag || 'Destaque'}</div>
                                  <div className="news-overlay">
                                      {noticia.text || noticia.title}
                                  </div>
                              </div>
                          </a>
                          );
                      })}
                  </div>
              );
          }
      }

      // 5.6 Renderizar Entregas dinâmicas (HOME)
      if (domNode.attribs && domNode.attribs.id === 'entregas-destaque') {
          if (noticias.length > 3) {
              return (
                 <div className="entregas-left" id="entregas-destaque">
                      {noticias.slice(3, 6).map((entrega, idx) => {
                          const entregaLink = entrega.link === 'https://www.agenciabrasilia.df.gov.br/' 
                              ? `https://www.agenciabrasilia.df.gov.br/?s=${encodeURIComponent(entrega.text || entrega.title)}` 
                              : entrega.link;
                          return (
                          <a href={entregaLink} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}} key={idx}>
                              <div className="entrega-dark-card">
                                  <div className="entrega-dark-img" style={{ backgroundImage: `url(${entrega.img})` }}></div>
                                  <div className="entrega-dark-text">
                                      <div className="entrega-dark-pill">{entrega.area || 'Destaque'}</div><br/>
                                      {entrega.text}
                                  </div>
                              </div>
                          </a>
                          );
                      })}
                 </div>
              )
          }
      }

      // ======================================
      // 5.7 NOVO COMPONENTE: NOTÍCIAS REDESIGN
      // ======================================
      if (domNode.attribs && domNode.attribs.class === 'news-redesign-container') {
          const getTag = (n) => n.area || n.tag;
          const categorias = ['Todas', ...new Set(noticias.map(n => getTag(n)).filter(Boolean))];
          const filteredNews = selectedCategory === 'Todas' ? noticias : noticias.filter(n => getTag(n) === selectedCategory);
          
          if (filteredNews.length === 0) return <div style={{padding:40, textAlign:'center'}}>Nenhuma notícia.</div>;

          // O Primeiro item no array filtrado vira o Destaque Master.
          const destaque = filteredNews[0];
          // O resto forma a grade inferior paginada
          const gridNews = filteredNews.slice(1);
          const ITEMS_PER_PAGE = 6;
          const totalPages = Math.ceil(gridNews.length / ITEMS_PER_PAGE);
          
          // Se de alguma forma o usuário mudou de categoria e a página atual exceder o limite, ajustamos (proteção React)
          const safePage = Math.min(newsPage, Math.max(1, totalPages));
          const currentPageNews = gridNews.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

          // Função para formatar o Título do Destaque de forma inteligente
          return (
              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                  {/* METADE SUPERIOR (OFF-WHITE) */}
                  <div className="news-top-half">
                      <div className="news-top-layout">
                          
                          {/* Coluna 1: Títulos Gigantes */}
                          <div className="news-title-col">
                              <div className="news-title-1">ACOMPANHE</div>
                              <div className="news-title-2">as ÚLTIMAS</div>
                              <div className="news-title-3">NOTÍCIAS:</div>
                          </div>

                          {/* Coluna 2: Menu Principal Vertical */}
                          <div className="news-filter-col">
                              {categorias.map((cat, idx) => {
                                  const isActive = selectedCategory === cat;
                                  return (
                                      <div 
                                          key={idx} 
                                          className={`news-filter-item ${isActive ? 'active' : ''}`}
                                          onClick={() => { setSelectedCategory(cat); setNewsPage(1); }}
                                      >
                                          {cat}
                                      </div>
                                  );
                              })}
                          </div>

                          {/* Coluna 3: Hero Card (Destaque Principal) */}
                          <a href={destaque.link || '#'} target="_blank" rel="noreferrer" style={{textDecoration:'none', display:'block'}}>
                              <div className="news-hero-board">
                                  <div className="news-hero-bg" style={{backgroundImage: `url(${realMedia.noticias[0]})`}}></div>
                                  <div className="news-hero-overlay">
                                      <div className="news-hero-pill">Destaque</div>
                                      <div className="news-hero-title">{destaque.text || destaque.title}</div>
                                  </div>
                              </div>
                          </a>

                      </div>
                  </div>

                  {/* METADE INFERIOR (BRANCO PURO) */}
                  <div className="news-bottom-half">
                      
                      {/* Grid de Cartões Menores */}
                      <div className="news-grid-bottom">
                          {currentPageNews.map((noticia, idx) => {
                              const imgIndex = ((safePage - 1) * ITEMS_PER_PAGE) + idx + 1; // +1 to offset Destaque
                              return (
                                  <a href={noticia.link} target="_blank" rel="noreferrer" style={{textDecoration:'none'}} key={idx}>
                                      <div className="news-standard-card">
                                          <div className="news-hero-bg" style={{backgroundImage: `url(${realMedia.noticias[imgIndex % realMedia.noticias.length]})`}}></div>
                                          <div className="news-standard-overlay">
                                              <div className="news-standard-pill">{getTag(noticia) || 'Geral'}</div>
                                              <div className="news-standard-title">{noticia.text || noticia.title}</div>
                                          </div>
                                      </div>
                                  </a>
                              );
                          })}
                      </div>

                      {/* Paginação */}
                      {totalPages > 1 && (
                          <div className="news-pagination-row">
                              {/* Gerar blocos de páginas */}
                              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                                  <button 
                                      key={page}
                                      className={`news-page-btn ${page === safePage ? 'active' : 'inactive'}`}
                                      onClick={() => setNewsPage(page)}
                                  >
                                      {page}
                                  </button>
                              ))}
                              
                              {/* Botão Próximo */}
                              {safePage < totalPages && (
                                  <button className="news-page-arrow" onClick={() => setNewsPage(safePage + 1)}>
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                  </button>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          );
      }      // ======================================
      // 5.8 NOVO COMPONENTE: PALAVRA DO DIA REDESIGN
      // ======================================
      if (domNode.attribs && domNode.attribs.class === 'palavra-redesign-container') {
          if (PALAVRAS_DUMMY.length === 0) return <div style={{padding:40, textAlign:'center'}}>Nenhuma mensagem hoje.</div>;

          const destaque = PALAVRAS_DUMMY[0];
          const gridPalavras = PALAVRAS_DUMMY.slice(1);
          const ITEMS_PER_PAGE = 4;
          const totalPages = Math.ceil(gridPalavras.length / ITEMS_PER_PAGE);
          
          const safePage = Math.min(palavraPage, Math.max(1, totalPages));
          const currentPalavras = gridPalavras.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

          return (
              <div className="palavra-redesign-wrapper">
                  
                  {/* Hero Superior */}
                  <div className="palavra-top-layout">
                      <div className="palavra-title-col">
                          <div className="palavra-title-light">Mensagem</div>
                          <div className="palavra-title-light">de <span className="palavra-title-bold">HOJE</span></div>
                          <div className="palavra-title-date">{destaque.dateLabel} · {destaque.date}</div>
                      </div>
                      
                      <div className="palavra-hero-card">
                          <div>
                              <div className="palavra-hero-text">{destaque.text}</div>
                              <div className="palavra-hero-verse">{destaque.ref}</div>
                          </div>
                          <button className="palavra-share-btn" onClick={() => console.log('Share clicked:', destaque.id)}>
                              Compartilhar
                              <div className="palavra-share-icon">
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3l7 7-7 7v-4h-2c-3.31 0-6 2.69-6 6v1H4v-1c0-4.96 4.04-9 9-9h1V3z"/></svg>
                              </div>
                          </button>
                      </div>
                  </div>

                  <div className="palavra-divider"></div>

                  {/* Histórico Abaixo */}
                  <div className="palavra-history-title">Mensagens Anteriores</div>
                  
                  <div className="palavra-history-layout">
                      {currentPalavras.map((palavra, idx) => (
                          <div className="palavra-history-card" key={idx}>
                              <div className="palavra-history-header">
                                  <div className="palavra-history-left">
                                      {/* Icone de livro com cruz branca simpático */}
                                      <div className="palavra-book-icon">
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M12 5v6"></path><path d="M10 7h4"></path></svg>
                                      </div>
                                      <div className="palavra-history-name">{palavra.title}</div>
                                  </div>
                                  <div className="palavra-history-datepill">{palavra.date}</div>
                              </div>
                              
                              <div className="palavra-history-text">{palavra.text}</div>
                              <div className="palavra-history-verse">{palavra.ref}</div>

                              <button className="palavra-share-btn" onClick={() => console.log('Share clicked:', palavra.id)}>
                                  Compartilhar
                                  <div className="palavra-share-icon">
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3l7 7-7 7v-4h-2c-3.31 0-6 2.69-6 6v1H4v-1c0-4.96 4.04-9 9-9h1V3z"/></svg>
                                  </div>
                              </button>
                          </div>
                      ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                      <div className="news-pagination-row" style={{marginTop: '40px'}}>
                          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                              <button 
                                  key={page}
                                  className={`news-page-btn ${page === safePage ? 'active' : 'inactive'}`}
                                  onClick={() => setPalavraPage(page)}
                              >
                                  {page}
                              </button>
                          ))}
                          
                          {safePage < totalPages && (
                              <button className="news-page-arrow" onClick={() => setPalavraPage(safePage + 1)}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                              </button>
                          )}
                      </div>
                  )}

              </div>
          );
      }
      
      // ======================================
      // 5.9 NOVO COMPONENTE: SOBRE IBANEIS REDESIGN
      // ======================================
      if (domNode.attribs && domNode.attribs.class === 'sobre-redesign-container') {
          
          const timeline = [
              { year: "1971", title: "Nasci em Brasília, no Hospital de Base, filho de pais piauienses.", spanText: "Nasci em Brasília," },
              { year: "Infância (anos 70/80)", title: "Cresci no interior do Piauí e me fixei em Corrente aos 8 anos, onde estudei e comecei a trabalhar ainda jovem.", spanText: "Infância (anos 70/80) —" },
              { year: "Anos 1980", title: "Concluí meus estudos em Corrente e trabalhei como feirante, empacotador e comerciante." },
              { year: "1986", title: "Voltei a Brasília, aos 15 anos, para estudar, morando com familiares em Sobradinho." },
              { year: "Anos 1990", title: "Me formei em Direito pelo UniCeub, fiz pós-graduação em São Paulo e abri meu escritório de advocacia na capital." },
              { year: "Anos 2000", title: "Consolidei minha carreira como advogado, atuando em diversas áreas do serviço público." },
              { year: "2007–2010", title: "Atuei na OAB nacional como secretário-geral da Comissão de Prerrogativas." },
              { year: "2008–2009", title: "Fui vice-presidente da OAB-DF." },
              { year: "2013–2015", title: "Tive a honra de presidir a OAB-DF." },
              { year: "2016–2019", title: "Atuei como diretor do Conselho Federal da OAB e corregedor-geral." },
              { year: "2018", title: "Após mais de 25 anos na advocacia, entrei na política e fui eleito governador do Distrito Federal." },
              { year: "2019", title: "Assumi o Governo do DF e iniciei um ciclo de transformações na nossa capital." },
              { year: "2020–2021", title: "Enfrentei a pandemia, ampliamos a rede de saúde, abrimos leitos, fortalecemos programas sociais e levamos apoio às famílias do DF." },
              { year: "2022", title: "Fui reeleito em primeiro turno, com o reconhecimento da população pelo trabalho realizado." },
              { year: "2023 – 2025", title: "Avançamos em obras, programas sociais e grandes projetos, para fortalecer o desenvolvimento do DF." },
              { year: "2026", title: "Encerro meu ciclo no Governo do Distrito Federal, com a sensação de dever cumprido e a certeza de ter deixado um DF mais organizado, moderno e melhor para a população." }
          ];

          return (
              <div className="sobre-redesign-wrapper">
                  
                  <div className="sobre-white-band">
                      {/* Faixa Branca Superior */}
                      <div className="sobre-top-layout">
                          <div className="sobre-hero-img-left" style={{backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.FOTO.BURITI.jpg?alt=media&token=ab1e2c2e-194d-48b5-bafa-0d12e43eb703')"}}></div>
                          <div className="sobre-hero-text-right">
                              <div className="sobre-title-light">Conheça mais</div>
                              <div className="sobre-title-light">um pouco</div>
                              <div className="sobre-title-bold">Sobre Mim</div>
                              
                              <div className="sobre-p">Assumimos o Distrito Federal em 2018 com desafios e colocamos como prioridade organizar a gestão e transformar projetos em resultados concretos para a população.</div>
                              <div className="sobre-p">Com foco na integração entre as áreas e desenvolvimento econômico, avançamos na modernização da cidade, ampliamos investimentos, fortalecemos o ambiente de negócios e aumentamos a capacidade de arrecadação do DF.</div>
                          </div>
                      </div>

                      {/* Faixa Branca Central */}
                      <div className="sobre-mid-layout">
                          <div className="sobre-mid-text-left">
                              <div className="sobre-p" style={{color:'#555',fontWeight:400}}>Entre os principais marcos, destacam-se grandes obras de infraestrutura e mobilidade, urbanização de regiões como Vicente Pires e Sol Nascente/Pôr do Sol, investimentos em saneamento e qualidade de vida, além da renovação da frota de ônibus e expansão de programas sociais que chegaram a quem mais precisa. Como o Cartão Gás e DF Social.</div>
                              <div className="sobre-p" style={{color:'#555',fontWeight:400}}>O resultado é uma gestão marcada por obras e políticas públicas que mudaram a cidade e melhoraram a vida da população.</div>
                          </div>
                          <div className="sobre-mid-img-right" style={{backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FNOSSO.NATAL.RESTAURANTE.jpg?alt=media&token=f659992a-5470-4d7a-bf32-8e30aacf07f1')"}}></div>
                      </div>
                  </div>

                  <div className="sobre-gray-band">
                      {/* Cartão Trajetória Cruzando Faixas */}
                      <div className="sobre-trajetoria-card">
                          <div className="sobre-traj-img" style={{backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.ABRA%C3%87O.jpg?alt=media&token=9aea591c-9d69-448f-8a5a-9e06e885d049')"}}></div>
                          <div className="sobre-traj-text">
                              <div className="sobre-traj-title">MINHA <span>TRAJETÓRIA</span></div>
                              <div className="sobre-traj-p">Sou advogado nascido em Brasília, e tive a honra de ser o primeiro brasiliense a governar o Distrito Federal. Fui eleito em 2018 e reeleito em 2022, cumprindo dois mandatos à frente do DF entre 2019 e 2026, sempre com o compromisso de trabalhar pela população e mudar a nossa capital.</div>
                          </div>
                      </div>

                      <div className="sobre-bottom-grid">
                          {/* Coluna Esq: Linha do Tempo */}
                          <div className="sobre-timeline-col">
                              <div className="sobre-section-title">Linha Do Tempo</div>
                              <div className="s-timeline">
                                  {timeline.map((item, idx) => (
                                      <div className="s-timeline-item" key={idx}>
                                          <div className="s-timeline-dot"></div>
                                          <div className="s-timeline-year">{item.year}</div>
                                          <div className="s-timeline-text">
                                              {item.spanText ? <span><span className="s-bold">{item.spanText}</span> {item.title.replace(item.spanText, '').trim()}</span> : <span>{item.title}</span>}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Coluna Dir: Widgets de Dados */}
                          <div className="sobre-widgets-col">
                              {/* W1: Resultados em Números */}
                              <div className="s-widget s-widget-light">
                                  <div className="s-widget-title">Resultados Em Números</div>
                                  <ul className="s-widget-list">
                                      <li>13 escolas</li>
                                      <li>11 viadutos</li>
                                      <li>7 Upas</li>
                                      <li>6 rodoviárias</li>
                                      <li>4 restaurantes comunitários</li>
                                      <li>27 creches</li>
                                      <li>14 mil moradias</li>
                                  </ul>
                              </div>
                              
                              {/* W2: Principais Ações */}
                              <div className="s-widget s-widget-dark">
                                  <div className="s-widget-title" style={{color:'#fff'}}>Nossas Principais Ações</div>
                                  <ul className="s-widget-list" style={{color:'#fff'}}>
                                      <li>Túnel de Taguatinga</li>
                                      <li>Vai de Graça</li>
                                      <li>Drenar DF</li>
                                      <li>UnDF</li>
                                      <li>Delegacias 24h</li>
                                      <li>Almoço por R$ 1</li>
                                      <li>Teatro Nacional</li>
                                      <li>RenovaDF</li>
                                      <li>Cartão Gás</li>
                                      <li>Cartão Uniforme Escolar</li>
                                      <li>Cartão Material Escolar</li>
                                  </ul>
                              </div>

                              {/* W3: Top 5 RAAs */}
                              <div className="s-widget s-widget-light">
                                  <div className="s-widget-title">Top 5 RAs Com Maior Investimento</div>
                                  <div className="s-widget-capsule-list">
                                      <div className="s-widget-capsule">
                                          <div className="s-cap-left">Plano Piloto</div><div className="s-cap-right">R$ 1.155.996.160,31</div>
                                      </div>
                                      <div className="s-widget-capsule">
                                          <div className="s-cap-left">Vicente Pires</div><div className="s-cap-right">R$ 572.329.562,56</div>
                                      </div>
                                      <div className="s-widget-capsule">
                                          <div className="s-cap-left">Taguatinga</div><div className="s-cap-right">R$ 503.308.319,90</div>
                                      </div>
                                      <div className="s-widget-capsule">
                                          <div className="s-cap-left">Ceilândia</div><div className="s-cap-right">R$ 270.718.424,34</div>
                                      </div>
                                      <div className="s-widget-capsule">
                                          <div className="s-cap-left">Lago Norte</div><div className="s-cap-right">R$ 268.003.571,86</div>
                                      </div>
                                  </div>
                              </div>

                              {/* W4: Redes Sociais */}
                              <div className="s-widget s-widget-dark">
                                  <div className="s-widget-title" style={{color:'#fff'}}>Acompanhe Mais Nas Redes Sociais</div>
                                  <div className="s-social-grid">
                                      <div className="s-social-icon">IG</div>
                                      <div className="s-social-icon">f</div>
                                      <div className="s-social-icon">X</div>
                                      <div className="s-social-icon">T</div>
                                      <div className="s-social-icon">Tk</div>
                                      <div className="s-social-icon">YT</div>
                                      <div className="s-social-icon">in</div>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          );
      }

      // ======================================
      // 5.10 NOVO COMPONENTE: POSTS REDESIGN
      // ======================================
      if (domNode.attribs && domNode.attribs.class === 'posts-redesign-container') {
          const POSTS_DUMMY = [
              { 
                  id: 1, 
                  source: "R7 Brasília", 
                  sourceAcronym: "R7",
                  date: "28 de março de 2026", 
                  title: "Ibaneis assina renúncia ao governo do DF para concorrer ao Senado", 
                  img: "https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIBANEIS.FOTO.BURITI.jpg?alt=media&token=ab1e2c2e-194d-48b5-bafa-0d12e43eb703", 
                  category: "Senado",
                  url: "https://noticias.r7.com/brasilia/ibaneis-assina-renuncia-ao-governo-do-df-para-concorrer-ao-senado-28032026/"
              },
              { 
                  id: 2, 
                  source: "GPS Brasília", 
                  sourceAcronym: "GPS",
                  date: "09 de abril de 2026", 
                  title: "Ibaneis Rocha retoma carteira da OAB e sinaliza candidatura ao Senado com discurso de diálogo", 
                  img: "https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FIbaneis.12.jpg?alt=media&token=c19f56e0-05de-4d7e-abf6-a36fd4cd3b51", 
                  category: "Política",
                  url: "https://gpsbrasilia.com.br/ibaneis-carteira-oab-candidatura-senado/"
              },
              { 
                  id: 3, 
                  source: "Metrópoles", 
                  sourceAcronym: "Met",
                  date: "27 de março de 2026", 
                  title: "Ibaneis diz que deixa GDF com \"sensação de missão cumprida\", fala sobre eleições e crise do BRB.", 
                  img: "https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FMetropoles.Posse.jpg?alt=media&token=68a2bf62-3fc4-47fd-8bb0-07bf11c2a11b", 
                  category: "Brasília",
                  url: "https://www.metropoles.com/colunas/grande-angular/ibaneis-diz-que-deixa-gdf-com-sensacao-de-missao-cumprida-fala-sobre-eleicoes-e-crise-do-brb"
              }
          ];

          const filteredPosts = postsFilter === 'Todos' 
              ? POSTS_DUMMY 
              : POSTS_DUMMY.filter(p => p.category === postsFilter);

          // Pagination logic
          const POSTS_PER_PAGE = 3;
          const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
          const safePage = Math.min(postsPage, Math.max(1, totalPages));
          const currentPosts = filteredPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

          const filters = ['Todos', 'Política', 'Brasília', 'Senado', 'Educação'];

          return (
              <div className="posts-redesign-wrapper">
                  <div className="posts-container">
                      
                      {/* Bateria de Filtros */}
                      <div className="post-filters">
                          {filters.map(filter => (
                              <button 
                                  key={filter} 
                                  className={`post-filter-pill ${postsFilter === filter ? 'active' : ''}`}
                                  onClick={() => { setPostsFilter(filter); setPostsPage(1); }}
                              >
                                  {filter}
                              </button>
                          ))}
                      </div>

                      {/* Lista de Posts (Cards) */}
                      <div>
                          {currentPosts.map(post => (
                              <a href={post.url} target="_blank" rel="noreferrer" className="post-card" key={post.id}>
                                  <div className="post-card-header">
                                      <div className="post-card-avatar">{post.sourceAcronym}</div>
                                      <div className="post-card-source">{post.source}</div>
                                      <div className="post-card-date">{post.date}</div>
                                  </div>
                                  <div className="post-card-img-container">
                                      <img src={post.img} alt={post.title} className="post-card-img" />
                                  </div>
                                  <div className="post-card-body">
                                      <div className="post-card-title">{post.title}</div>
                                      <button className="post-btn-floating">veja completo</button>
                                  </div>
                              </a>
                          ))}
                          {currentPosts.length === 0 && (
                              <div style={{textAlign:'center', color:'#888', padding:'40px 0'}}>Nenhum post encontrado.</div>
                          )}
                      </div>

                      {/* Paginação */}
                      {totalPages > 1 && (
                          <div className="pagination" style={{marginTop: 40}}>
                              {Array.from({length: totalPages}).map((_, i) => {
                                  const pg = i + 1;
                                  return (
                                      <div 
                                          key={pg} 
                                          className={`pg ${pg === safePage ? 'ap' : ''}`}
                                          onClick={() => setPostsPage(pg)}
                                          style={{cursor: 'pointer'}}
                                      >
                                          {pg}
                                      </div>
                                  );
                              })}
                              {safePage < totalPages && (
                                  <div className="pg" onClick={() => setPostsPage(safePage + 1)} style={{cursor: 'pointer'}}>→</div>
                              )}
                          </div>
                      )}

                  </div>
              </div>
          );
      }

      // 5.9 BI ENTREGAS Dashboard completo
      if (domNode.attribs && domNode.attribs.id === 'bi-section') {
          const biFiltered = entregas.filter(e => {
              if (biFilterArea !== 'Todas' && e.area !== biFilterArea) return false;
              if (biFilterRegiao !== 'Todas' && e.regiao !== biFilterRegiao) return false;
              if (biFilterPeriodo !== 'Todos' && e.periodo !== biFilterPeriodo) return false;
              return true;
          });

          const allAreas = ['Todas', ...new Set(entregas.map(e => e.area))];
          const allRegioes = ['Todas', ...new Set(entregas.map(e => e.regiao))];
          const allPeriodos = ['Todos', ...new Set(entregas.map(e => e.periodo)).values()].sort();

          // Count por area para o gráfico
          const areaCounts = {};
          entregas.forEach(e => { areaCounts[e.area] = (areaCounts[e.area] || 0) + 1; });
          const regiaoCounts = {};
          entregas.forEach(e => { regiaoCounts[e.regiao] = (regiaoCounts[e.regiao] || 0) + 1; });
          const totalEntregas = entregas.length;
          const maxCount = Math.max(...Object.values(areaCounts));

          return (
              <div className="section" id="bi-section" style={{padding: 0, overflow:'hidden', backgroundColor: '#fff', width: '100%', maxWidth: 'none'}}>
                  {/* Hero Banner Fluido (100% width) */}
                  <div className="bi-hero" style={{marginBottom: 0}}>
                      <img src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FBanner%20Entregas.png?alt=media&token=42b82ace-7de2-4bdc-b63c-ce61e2771e15" alt="Banner Entregas" />
                  </div>

                  {/* Caixas de Investimento (Imagem) com sobreposição */}
                  <div style={{width: '100%', maxWidth: '1000px', margin: '-60px auto 40px auto', position: 'relative', zIndex: 10, padding: '0 20px'}}>
                      <img src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FInvestimentos.png?alt=media&token=4ffd53e7-7a18-4138-82f2-81453acbff40" alt="Investimentos em Saúde, Segurança e Educação" style={{width: '100%', display: 'block'}} />
                  </div>

                  <div style={{padding: '0 20px', maxWidth: '1100px', margin: '0 auto'}}>
                      {/* Área de Filtros */}
                      <div className="bi-filter-container">
                          <div className="bi-filter-header">Filtrar Entregas</div>
                          <div className="bi-filter-row">
                              <div className="bi-select-wrapper">
                                  <select value={biFilterRegiao} onChange={e => setBiFilterRegiao(e.target.value)}>
                                      <option value="Todas" hidden>Cidade: Todas</option>
                                      {allRegioes.map(r => <option key={r} value={r}>{r === 'Todas' ? 'Cidade: Todas' : r}</option>)}
                                  </select>
                              </div>
                              <div className="bi-select-wrapper">
                                  <select value={biFilterArea} onChange={e => setBiFilterArea(e.target.value)}>
                                      <option value="Todas" hidden>Área: Todas</option>
                                      {allAreas.map(a => <option key={a} value={a}>{a === 'Todas' ? 'Área: Todas' : a}</option>)}
                                  </select>
                              </div>
                              <div className="bi-select-wrapper">
                                  <select value={biFilterPeriodo} onChange={e => setBiFilterPeriodo(e.target.value)}>
                                      <option value="Todos" hidden>Período: Todos</option>
                                      {allPeriodos.map(p => <option key={p} value={p}>{p === 'Todos' ? 'Período: Todos' : p}</option>)}
                                  </select>
                              </div>
                              <button className="bi-btn-aplicar">Aplicar</button>
                          </div>
                      </div>

                      {/* Tags de Filtros Ativos */}
                      {(biFilterRegiao !== 'Todas' || biFilterArea !== 'Todas' || biFilterPeriodo !== 'Todos') && (
                      <div className="bi-active-filters">
                          <span style={{fontSize: 14, color: '#aaa'}}>Filtrando:</span>
                          {biFilterRegiao !== 'Todas' && <div className="bi-filter-tag" onClick={() => setBiFilterRegiao('Todas')}>{biFilterRegiao} <span>×</span></div>}
                          {biFilterArea !== 'Todas' && <div className="bi-filter-tag" onClick={() => setBiFilterArea('Todas')}>{biFilterArea} <span>×</span></div>}
                          {biFilterPeriodo !== 'Todos' && <div className="bi-filter-tag" onClick={() => setBiFilterPeriodo('Todos')}>{biFilterPeriodo} <span>×</span></div>}
                      </div>
                      )}

                      {/* Grid de Entregas (Cards) */}
                      <div className="bi-grid">
                          {biFiltered.slice(0, biVisibleCards).map((e, idx) => {
                              const fallbackImg = "https://www.agenciabrasilia.df.gov.br/wp-content/themes/agencia-brasilia/assets/images/placeholder.jpg";
                              return (
                              <a href={e.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit', height: '100%', display:'block'}} key={idx}>
                                  <div className="bi-card" style={{height: '100%', cursor: 'pointer', overflow:'hidden', display:'flex', flexDirection:'column'}}>
                                      <div style={{
                                          width: '100%', 
                                          height: '140px', 
                                          backgroundImage: `url(${e.img && e.img !== '' ? e.img : fallbackImg})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundColor: '#eee'
                                      }}></div>
                                      <div style={{padding: '16px', flex:1, display:'flex', flexDirection:'column'}}>
                                          <div className="bi-card-pills" style={{marginBottom: '10px'}}>
                                              <div className="bi-card-pill" style={{display:'flex', alignItems:'center', gap:4}}>
                                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                  {e.regiao !== 'N/A' ? e.regiao : 'Geral'}
                                              </div>
                                              <div className="bi-card-pill">{e.area}</div>
                                          </div>
                                          <div className="bi-card-text" style={{flex:1}}>{e.text || e.title}</div>
                                          <div className="bi-card-date" style={{marginTop: 'auto'}}>{e.date}</div>
                                      </div>
                                  </div>
                              </a>
                              );
                          })}
                      </div>
                      {biFiltered.length === 0 && <div style={{textAlign:'center', padding:40, color:'#999'}}>Nenhuma entrega encontrada para estes filtros.</div>}
                      {biFiltered.length > biVisibleCards && <div style={{textAlign:'center', marginBottom: 30}}><button onClick={() => setBiVisibleCards(biVisibleCards + 18)} style={{background:'transparent', border:'1px solid #ccc', padding:'8px 24px', borderRadius:20, fontSize:12, cursor:'pointer'}}>Ver mais</button></div>}

                      {/* Painéis Analytics Inferiores */}
                      <div className="bi-analytics-row">
                          {/* Left: Bars */}
                          <div className="bi-analytics-box">
                              <div className="bi-analytics-title">Entregas por Área</div>
                              <div style={{display:'flex', flexDirection:'column', gap: 12}}>
                                  {Object.entries(areaCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([area, count]) => (
                                      <div className="bi-bar-row" key={area}>
                                          <div className="bi-bar-pill">{area}</div>
                                          <div className="bi-bar-track">
                                              <div className="bi-bar-fill" style={{width: `${Math.max(15, (count / maxCount) * 100)}%`}}>{count} entregas</div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          {/* Right: R.A.s */}
                          <div className="bi-analytics-box">
                              <div className="bi-analytics-title-cen">Top 5 R.As com mais entregas</div>
                              <div style={{display:'flex', flexDirection:'column', gap: 12}}>
                                  {Object.entries(regiaoCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([regiao, count]) => (
                                      <div style={{display:'flex', gap: 12, alignItems:'center'}} key={regiao}>
                                          <div style={{background:'#002e77', color:'#fff', padding:'6px 12px', borderRadius:20, flex:1, fontSize:11, fontWeight:700}}>{regiao}</div>
                                          <div style={{background:'#0278F8', color:'#fff', padding:'6px 16px', borderRadius:20, fontSize:11, fontWeight:700}}>{count}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      // Capturamos a "div" container que envolve a seção de Vídeos Mais recentes
      if (domNode.name === 'div' && domNode.children?.some(n => n.attribs?.class === 'section-label' && n.children?.[0]?.data?.includes('deos'))) {
         const videosVisiveis = mostrarMaisVideos ? videos : videos.slice(0, 3);
         return (
             <div>
                <div className="section-label" style={{color: '#0278F8', fontSize: '14px', marginBottom: 16, textTransform: 'uppercase', fontWeight: 800}}>VÍDEOS RECENTES</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                    {videosVisiveis.map((vid, idx) => {
                        const vidId = vid.url ? vid.url.split('v=')[1]?.split('&')[0] : (vid.id || "F0K0Xy0K0kU");
                        return (
                            <div key={idx} style={{border: '1px solid #e0e0e0', borderRadius: 8, overflow:'hidden', boxShadow: '0 4px 8px rgba(0,39,89,0.05)'}}>
                                <iframe 
                                    width="100%" 
                                    height="200" 
                                    src={`https://www.youtube.com/embed/${vidId}`} 
                                    title={vid.title || "Agência Brasília Youtube"} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen>
                                </iframe>
                                <div style={{padding: 8, fontSize: 13, background:'#002759', color:'#fff', fontWeight:600}}>{vid.title || "Atualização Oficial GDF"}</div>
                            </div>
                        );
                    })}
                </div>
                {videos.length > 3 && (
                    <button 
                        onClick={() => setMostrarMaisVideos(!mostrarMaisVideos)}
                        style={{
                            marginTop: 16, width: '100%', padding: '12px 0',
                            background: '#0278F8', color: '#FFF', border: 'none', borderRadius: 8,
                            fontWeight: 'bold', cursor: 'pointer', transition: '0.2s background', fontSize: 13
                        }}
                        onMouseOver={(e) => e.target.style.background = '#002759'}
                        onMouseOut={(e) => e.target.style.background = '#0278F8'}
                    >
                        {mostrarMaisVideos ? "Ver menos" : "Ver mais vídeos"}
                    </button>
                )}
             </div>
         );
      }

      // 7. Botão Busca e Ver entregas estilizados
      if (domNode.attribs && domNode.name === 'button' && domNode.children && domNode.children[0] && domNode.children[0].data === 'Busca de Dados (IA)') {
        return (
          <button 
            style={{cursor:'pointer', background:'#fff', color:'#0278F8', width:'130px', height:'32px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', border:'2px solid #0278F8', transition:'0.2s', boxShadow:'0 2px 8px rgba(2,120,248,0.2)'}}
            onClick={() => setChatOpen(true)}
          >
            Busca IA (Smart)
          </button>
        );
      }
      
      if (domNode.attribs && domNode.name === 'button' && domNode.children && domNode.children[0] && domNode.children[0].data === 'Ver entregas') {
        return (
          <button 
            style={{cursor:'pointer', border:'none', background:'#0278F8', color:'#fff', width:'120px', height:'32px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', boxShadow:'0 2px 8px rgba(2,120,248,0.3)'}}
            onClick={() => setActiveTab('entregas')}
          >
            Ver entregas
          </button>
        );
      }

      // 8. Roteador de paginas principal
      if (domNode.attribs && domNode.attribs.id && domNode.attribs.id.startsWith('page-')) {
        let id = domNode.attribs.id.replace('page-', '');
        return (
           <div className={`page ${activeTab === id ? 'active' : ''}`} id={`page-${id}`}>
              {domToReact(domNode.children, options)}
           </div>
        );
      }
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/ibaneisoficial?igsh=MWlsZnl6NmYxeXd6Yw%3D%3D&utm_source=qr',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1S6rzPh7RS/?mibextid=wwXIfr',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/ibaneisoficial?s=21',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Threads',
      url: 'https://www.threads.com/@ibaneisoficial?igshid=NTc4MTIwNjQ2YQ==',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.52.85-6.374 2.495-8.423C5.844 1.205 8.597.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.51 5.467l-2.04.569c-.556-1.96-1.51-3.467-2.84-4.492C16.365 2.625 14.5 2.02 12.19 2H12.18c-2.952.02-5.186.976-6.638 2.84C4.184 6.612 3.5 9.07 3.5 12.068c0 3 .684 5.456 2.042 7.228 1.452 1.864 3.686 2.817 6.638 2.84h.007c2.59-.02 4.537-.748 5.782-2.163 1.337-1.52 1.976-3.74 1.9-6.59-.017-.657-.062-1.257-.133-1.793-.67.148-1.355.24-2.05.266-.052.002-.103.003-.154.003-2.21 0-3.946-.705-4.94-1.987-.846-1.093-1.1-2.593-.743-4.207.478-2.176 2.018-3.744 4.065-4.197.644-.14 1.38-.166 2.113-.076 1.32.164 2.473.666 3.29 1.426.62.578 1.04 1.297 1.233 2.1.183.763.161 1.59-.065 2.46-.3 1.148-.934 2.065-1.837 2.666.126.58.216 1.2.27 1.848.083 1.028.1 2.034.05 2.987h-.001c-.095 1.823-.58 3.378-1.404 4.523C18.26 22.935 15.573 24 12.186 24zm2.287-14.658c-.37-.046-.748-.036-1.11.035-1.27.272-2.145 1.208-2.457 2.6-.228 1.036-.101 1.966.36 2.567.576.743 1.618 1.12 3.012 1.12.042 0 .085 0 .128-.002.573-.02 1.14-.1 1.693-.24-.093-.52-.143-1.08-.148-1.67-.009-.979.064-2.023.24-3.108-.5-.715-1.084-1.139-1.718-1.302z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@ibaneisoficial?_r=1&_t=ZS-95P8OjUObX2',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.19 8.19 0 004.78 1.52V6.56a4.85 4.85 0 01-1.01.13z"/>
        </svg>
      )
    },
    {
      name: 'Kwai',
      url: 'https://k.kwai.com/u/@IbaneisOficial/zJV1C02D',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 17l-4-4.5V17H10V7h3.5v4.5L17.5 7H21l-4.5 5 4.5 5h-3.5z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@ibaneisrochaoficial?si=rbewEqan4ifLg84W',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
  ];

  return (
    <>
      <main style={{width:'100%'}}>
        {parse(rawHTML, options)}
      </main>

      {/* Footer com redes sociais */}
      <footer style={{
        background: '#002759',
        color: '#fff',
        padding: '32px 24px',
        marginTop: 0
      }}>
        <div style={{maxWidth: 900, margin: '0 auto'}}>
          {/* Logo e tagline */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28}}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2FLOGO%20IBANEIS%20variacoes_BRANCA.AZUL%20ESCURO.png?alt=media&token=2c0c1b73-225e-4ec2-bec1-4ca8cacd4a00"
              alt="Ibaneis Rocha"
              style={{height: 40, marginBottom: 10, filter: 'brightness(0) invert(1)'}}
            />
            <p style={{fontSize: 12, color: '#8eadd4', textAlign: 'center', margin: 0}}>
              Portal oficial de dados, obras e entregas de Ibaneis Rocha como Governador do DF.
            </p>
          </div>

          {/* Redes Sociais */}
          <div style={{marginBottom: 24}}>
            <p style={{fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#8eadd4', textAlign: 'center', marginBottom: 16, fontWeight: 700}}>
              Siga nas redes sociais
            </p>
            <div style={{display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap'}}>
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Divider + créditos */}
          <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center'}}>
            <p style={{fontSize: 11, color: '#8eadd4', margin: 0}}>
              © 2019–2026 Ibaneis Rocha · Governo do Distrito Federal · Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>

      {chatOpen && <AIChatWidget onClose={() => setChatOpen(false)} />}
    </>
  );
}
