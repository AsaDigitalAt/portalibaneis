"use client";
import parse, { domToReact } from 'html-react-parser';
import { useState, useEffect } from 'react';
import { rawHTML } from './wireframe.js';
import AIChatWidget from '@/components/AIChatWidget';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [igPosts, setIgPosts] = useState([]);
  const [mostrarMaisVideos, setMostrarMaisVideos] = useState(false);
  
  // Estados de Notícias
  const [noticias, setNoticias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Estados de Entregas BI
  const [entregas, setEntregas] = useState([]);
  const [biFilterArea, setBiFilterArea] = useState('Todas');
  const [biFilterRegiao, setBiFilterRegiao] = useState('Todas');
  const [biFilterPeriodo, setBiFilterPeriodo] = useState('Todos');

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
            setIgPosts(d.posts.slice(0, 2));
         } else {
            // Posts reais mais recentes do @ibaneisoficial (fallback quando Apify não configurado)
            setIgPosts([
              {
                url: 'https://www.instagram.com/reel/DW9AO3QROKy/',
                caption: 'No DF, quem usa o transporte público economiza! #IbaneisRocha',
                likesCount: 0,
                commentsCount: 0
              },
              {
                url: 'https://www.instagram.com/reel/DW6zjQUxt80/',
                caption: 'Agora, o DF recebe grandes eventos que movimentam a economia e valorizam a cidade. #IbaneisRocha',
                likesCount: 0,
                commentsCount: 0
              }
            ]);
         }
      })
      .catch(() => {
        // Fallback garantido mesmo se a API falhar
        setIgPosts([
          {
            url: 'https://www.instagram.com/reel/DW9AO3QROKy/',
            caption: 'No DF, quem usa o transporte público economiza! #IbaneisRocha',
            likesCount: 0,
            commentsCount: 0
          },
          {
            url: 'https://www.instagram.com/reel/DW6zjQUxt80/',
            caption: 'Agora, o DF recebe grandes eventos que movimentam a economia e valorizam a cidade. #IbaneisRocha',
            likesCount: 0,
            commentsCount: 0
          }
        ]);
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
      
      // 2. Transpirar shell
      if (domNode.attribs && domNode.attribs.class === 'browser') {
        return <div style={{width:'100%', minHeight:'100vh'}}>{domToReact(domNode.children, options)}</div>;
      }

      // 3. Ativar o Menu Principal
      if (domNode.attribs && domNode.attribs.class === 'nav-links') {
        const tabs = [
          { id: 'home', label: 'Home' },
          { id: 'noticias', label: 'Notícias' },
          { id: 'posts', label: 'Posts Rápidos' },
          { id: 'entregas', label: 'Entregas (BI)' },
          { id: 'palavra', label: 'Palavra do Dia' },
          { id: 'sobre', label: 'Sobre Ibaneis' }
        ];
        return (
          <div className="nav-links">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`nav-link ${activeTab === tab.id ? 'ap' : ''}`}
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

      // 5. Substituir as caixas de "Posts Rápidos" ou "Social" pelo layout de Thread / Box arredondada sem o Thumbnail
      if (domNode.attribs && domNode.attribs.class === 'post-rapido') {
         const post = igPosts[igIdx] || null;
         igIdx++;
         return (
             <div className="post-rapido-container" style={{borderRadius: 12, border: '1px solid #e0e0e0', background: '#FFF', marginBottom: 12, transition: 'box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,39,89,0.03)'}}>
                 {post ? (
                    <a href={post.url} target="_blank" rel="noreferrer" style={{textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: 16}}>
                        {/* Header: Avatar e Nome */}
                        <div style={{display:'flex', alignItems:'center', marginBottom: 12}}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/base-arquivos.firebasestorage.app/o/SITE%2Fibaneis%20foto%20de%20perfil.jpg?alt=media&token=f60d6e27-701e-48db-a907-0be7749a8dd4" alt="Ibaneis Rocha" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }} />
                            <span style={{fontWeight: 700, fontSize: 13, color: '#002759'}}>Ibaneis Rocha</span>
                            <span style={{color: '#888', fontSize: 11, marginLeft: 6}}>@ibaneisoficial</span>
                        </div>
                        
                        {/* Body: Texto */}
                        <p style={{fontSize: 13, color: '#444', marginBottom: 14, lineHeight: 1.5, minHeight: 40}}>
                           {post.caption?.substring(0, 160)}{post.caption?.length > 160 ? '...' : ''}
                        </p>
                        
                        {/* Footer: Ícones */}
                        <div style={{display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid #f0f0f0', paddingTop: 10}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 6, color: '#999', fontSize: 12}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                <span style={{fontWeight: 600}}>{post.likesCount || 0}</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: 6, color: '#999', fontSize: 12}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                <span style={{fontWeight: 600}}>{post.commentsCount || 0}</span>
                            </div>
                        </div>
                    </a>
                 ) : (
                    <div style={{display: 'flex', alignItems: 'center', padding: 24, paddingLeft: 16}}>
                       <div style={{width: 32, height: 32, borderRadius: '50%', background: '#eee', marginRight: 12}}></div>
                       <div style={{flex: 1}}>
                           <div style={{height: 12, background: '#eee', width: '60%', marginBottom: 8, borderRadius: 4}}></div>
                           <div style={{height: 12, background: '#eee', width: '40%', borderRadius: 4}}></div>
                       </div>
                    </div>
                 )}
             </div>
         );
      }

      // 5.5 Renderizar noticias dinâmicas (HOME)
      if (domNode.attribs && domNode.attribs.id === 'noticias-destaque') {
          if (noticias.length > 0) {
              return (
                  <div className="g3" style={{marginBottom: 8}} id="noticias-destaque">
                      {noticias.slice(0, 3).map((noticia, idx) => (
                          <div className="card" key={idx}>
                              <a href={noticia.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
                                  <div className="card-thumb" style={{
                                      backgroundImage: `url(${noticia.img})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      height: 90
                                  }}></div>
                                  <div className="card-body">
                                      <div className="tag">{noticia.area || noticia.tag || 'Destaque'}</div>
                                      <div style={{fontSize: 10, fontWeight: 600, lineHeight: 1.3, color: '#333'}}>
                                          {noticia.text}
                                      </div>
                                  </div>
                              </a>
                          </div>
                      ))}
                  </div>
              );
          }
      }

      // 5.6 Renderizar Entregas dinâmicas (HOME)
      if (domNode.attribs && domNode.attribs.id === 'entregas-destaque') {
          if (noticias.length > 3) {
              return (
                 <div style={{display:'flex', flexDirection:'column', gap: 6}} id="entregas-destaque">
                      {noticias.slice(3, 6).map((entrega, idx) => (
                          <a href={entrega.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}} key={idx}>
                              <div className="entrega-card">
                                  <div className="tag">Destaque</div>
                                  <div style={{fontSize: 11, fontWeight: 600, color: '#222', lineHeight: 1.2, margin: '4px 0'}}>
                                      {entrega.text}
                                  </div>
                                  <div className="city-row">
                                      <div className="city-dot"></div>
                                      <span style={{fontSize: 9, color: '#777'}}>Todo o DF</span>
                                  </div>
                              </div>
                          </a>
                      ))}
                 </div>
              )
          }
      }

      // 5.7 Renderizar Filtros Dinâmicos
      // 5.7 Notícia destaque hero (topo da página Notícias)
      if (domNode.attribs && domNode.attribs.id === 'noticias-destaque-hero') {
          if (noticias.length > 0) {
              const hero = noticias[0];
              return (
                  <a href={hero.link} target="_blank" rel="noreferrer"
                      style={{textDecoration:'none', color:'inherit', display:'block'}} id="noticias-destaque-hero">
                      <div className="card" style={{display:'grid', gridTemplateColumns:'190px 1fr', marginBottom:12}}>
                          <div style={{
                              backgroundImage: `url(${hero.img})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              minHeight:110, borderRadius:'7px 0 0 7px', position:'relative'
                          }}>
                          </div>
                          <div style={{padding:14}}>
                              <div className="tag">{hero.area}</div>
                              <div style={{fontSize:16, fontWeight:800, lineHeight:1.2, color:'#1a1a18', marginBottom:8}}>{hero.text}</div>
                              <div style={{fontSize:11, color:'#555', lineHeight:1.4}}>{hero.date}</div>
                          </div>
                      </div>
                  </a>
              );
          }
      }

      // 5.7 comentário removido - continuação abaixo
      // 5.DX Renderizar Filtros Dinâmicos (usa campo 'area' que é o que o JSON de entregas retorna)
      if (domNode.attribs && domNode.attribs.id === 'noticias-filtros') {
          const getTag = (n) => n.area || n.tag;
          const categorias = ['Todas', ...new Set(noticias.map(n => getTag(n)).filter(Boolean))];
          return (
              <div style={{display:'flex', gap: 6, flexWrap:'wrap', marginBottom: 14}} id="noticias-filtros">
                  {categorias.map((cat, idx) => {
                      const count = cat === 'Todas' ? noticias.length : noticias.filter(n => getTag(n) === cat).length;
                      const isActive = selectedCategory === cat;
                      return (
                          <div
                              key={idx}
                              onClick={() => setSelectedCategory(cat)}
                              style={{
                                  padding: '4px 12px',
                                  fontSize: 10,
                                  borderRadius: 12,
                                  cursor: 'pointer',
                                  fontWeight: 700,
                                  color: isActive ? '#fff' : '#444',
                                  background: isActive ? '#0278F8' : '#e0dfd9',
                                  transition: '0.2s'
                              }}
                          >
                              {cat} ({count})
                          </div>
                      );
                  })}
              </div>
          );
      }

      // 5.8 Renderizar Lista de Notícias (PÁGINA DE NOTÍCIAS) com Filtro
      if (domNode.attribs && domNode.attribs.id === 'noticias-lista') {
          const getTag = (n) => n.area || n.tag;
          const filteredNews = selectedCategory === 'Todas' ? noticias : noticias.filter(n => getTag(n) === selectedCategory);
          if (filteredNews.length > 0) {
              return (
                  <div className="g3" style={{marginBottom: 8}} id="noticias-lista">
                      {filteredNews.map((noticia, idx) => (
                          <a href={noticia.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}} className="card" key={idx}>
                              <div className="card-thumb" style={{
                                  backgroundImage: `url(${noticia.img})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                              }}></div>
                              <div className="card-body">
                                  <div className="tag">{getTag(noticia)}</div>
                                  <div style={{fontSize: 10, fontWeight: 600, lineHeight: 1.3, color: '#333'}}>
                                      {noticia.text}
                                  </div>
                              </div>
                          </a>
                      ))}
                  </div>
              )
          } else {
              return <div style={{padding: 20, textAlign: 'center', color: '#777', fontSize: 12}}>Nenhuma notícia encontrada nesta categoria.</div>;
          }
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
          const totalEntregas = entregas.length;
          const maxCount = Math.max(...Object.values(areaCounts));

          const areaColors = {
              'Saúde': '#0278F8', 'Educação': '#00B87A', 'Infraestrutura': '#F59E0B',
              'Segurança': '#EF4444', 'Economia': '#8B5CF6', 'Meio Ambiente': '#10B981',
              'Social': '#EC4899', 'Transportes': '#F97316', 'Habitação': '#6366F1', 'Outros': '#9CA3AF'
          };

          const selectStyle = {
              padding: '6px 10px', borderRadius: 6, border: '1px solid #e0dfd9',
              fontSize: 10, background: '#fff', color: '#333', cursor: 'pointer', minWidth: 140
          };

          return (
              <div className="section" id="bi-section">
                  {/* Header BI */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:16}}>
                      <div>
                          <div style={{fontSize:16, fontWeight:800, color:'#1a1a18', marginBottom:4}}>Entregas do Governo (BI)</div>
                          <div style={{fontSize:11, color:'#777'}}>Jan/2023 – Mar/2026 · {totalEntregas} registros classificados por IA</div>
                      </div>
                      <div className="tag" style={{background:'#0278F8', color:'#fff', padding:'4px 10px', fontSize:9}}>
                          {biFiltered.length} resultado{biFiltered.length !== 1 ? 's' : ''}
                      </div>
                  </div>

                  {/* KPIs Fixas (Conforme Wireframe original) */}
                  <div className="g4" style={{marginBottom:16}}>
                      <div className="metric-card" style={{border:'1px solid #e5e4df'}}>
                          <div style={{fontSize:18, fontWeight:800, color:'#1a1a18', marginBottom:4}}>7 mil+</div>
                          <div style={{fontSize:8, color:'#aaa', textAlign:'center', textTransform:'uppercase'}}>Obras feitas</div>
                      </div>
                      <div className="metric-card" style={{border:'1px solid #e5e4df'}}>
                          <div style={{fontSize:14, fontWeight:800, color:'#1a1a18', marginBottom:4, paddingTop:4}}>R$ 15,3 bi</div>
                          <div style={{fontSize:8, color:'#aaa', textAlign:'center', textTransform:'uppercase'}}>Saúde</div>
                      </div>
                      <div className="metric-card" style={{border:'1px solid #e5e4df'}}>
                          <div style={{fontSize:14, fontWeight:800, color:'#1a1a18', marginBottom:4, paddingTop:4}}>R$ 15,6 bi</div>
                          <div style={{fontSize:8, color:'#aaa', textAlign:'center', textTransform:'uppercase'}}>Educação</div>
                      </div>
                      <div className="metric-card" style={{border:'1px solid #e5e4df'}}>
                          <div style={{fontSize:14, fontWeight:800, color:'#1a1a18', marginBottom:4, paddingTop:4}}>R$ 14 bi</div>
                          <div style={{fontSize:8, color:'#aaa', textAlign:'center', textTransform:'uppercase'}}>Segurança</div>
                      </div>
                  </div>

                  {/* Filtros */}
                  <div style={{background:'#fafaf7', border:'1px solid #e5e4df', borderRadius:8, padding:12, marginBottom:14, position:'relative'}}>
                      <div style={{fontSize:10, color:'#555', fontWeight:600, marginBottom:10}}>Filtrar entregas</div>
                      <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
                          <div style={{display:'flex', flexDirection:'column', gap:3}}>
                              <label style={{fontSize:8, color:'#aaa', textTransform:'uppercase'}}>Área</label>
                              <select style={selectStyle} value={biFilterArea} onChange={e => setBiFilterArea(e.target.value)}>
                                  {allAreas.map(a => <option key={a}>{a}</option>)}
                              </select>
                          </div>
                          <div style={{display:'flex', flexDirection:'column', gap:3}}>
                              <label style={{fontSize:8, color:'#aaa', textTransform:'uppercase'}}>Região</label>
                              <select style={selectStyle} value={biFilterRegiao} onChange={e => setBiFilterRegiao(e.target.value)}>
                                  {allRegioes.map(r => <option key={r}>{r}</option>)}
                              </select>
                          </div>
                          <div style={{display:'flex', flexDirection:'column', gap:3}}>
                              <label style={{fontSize:8, color:'#aaa', textTransform:'uppercase'}}>Período</label>
                              <select style={selectStyle} value={biFilterPeriodo} onChange={e => setBiFilterPeriodo(e.target.value)}>
                                  {allPeriodos.map(p => <option key={p}>{p}</option>)}
                              </select>
                          </div>
                          {(biFilterArea !== 'Todas' || biFilterRegiao !== 'Todas' || biFilterPeriodo !== 'Todos') && (
                              <button onClick={() => { setBiFilterArea('Todas'); setBiFilterRegiao('Todas'); setBiFilterPeriodo('Todos'); }}
                                  style={{marginTop:14, padding:'6px 12px', background:'#ef4444', color:'#fff', border:'none', borderRadius:6, fontSize:9, cursor:'pointer', fontWeight:700}}>
                                  Limpar Filtros ×
                              </button>
                          )}
                      </div>
                      
                      {/* Chips ativos */}
                      {(biFilterArea !== 'Todas' || biFilterRegiao !== 'Todas' || biFilterPeriodo !== 'Todos') && (
                          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:10}}>
                              <span style={{fontSize:9, color:'#aaa'}}>Filtrando:</span>
                              {biFilterArea !== 'Todas' && <div style={{background:'#0278F820', color:'#0278F8', padding:'2px 8px', borderRadius:10, fontSize:9, fontWeight:600}}>{biFilterArea} ×</div>}
                              {biFilterRegiao !== 'Todas' && <div style={{background:'#0278F820', color:'#0278F8', padding:'2px 8px', borderRadius:10, fontSize:9, fontWeight:600}}>{biFilterRegiao} ×</div>}
                              {biFilterPeriodo !== 'Todos' && <div style={{background:'#0278F820', color:'#0278F8', padding:'2px 8px', borderRadius:10, fontSize:9, fontWeight:600}}>{biFilterPeriodo} ×</div>}
                          </div>
                      )}
                  </div>

                  {/* Grid de entregas estilo cards sem imagem (Wireframe original) */}
                  {biFiltered.length > 0 ? (
                      <div className="g3" style={{marginBottom:16}}>
                          {biFiltered.map((entrega, idx) => (
                              <a href={entrega.link} target="_blank" rel="noreferrer" key={idx} style={{textDecoration:'none', color:'inherit', display:'block'}}>
                                  <div className="entrega-card" style={{border:'1px solid #e5e4df', borderRadius:7, padding:'10px 12px', background:'#fff', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                      <div>
                                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:4}}>
                                              <div className="tag">{entrega.area}</div>
                                              <div style={{fontSize:8, color:'#aaa'}}>{new Date(entrega.date).toLocaleDateString('pt-BR')}</div>
                                          </div>
                                          <div style={{fontSize:11, fontWeight:600, color:'#222', lineHeight:1.2, margin:'4px 0'}}>
                                              {entrega.text.substring(0, 90)}{entrega.text.length > 90 ? '...' : ''}
                                          </div>
                                      </div>
                                      <div className="city-row" style={{display:'flex', alignItems:'center', gap:4, marginTop:8}}>
                                          <div className="city-dot" style={{width:7, height:7, borderRadius:'50%', background:'#bbb'}}></div>
                                          <span style={{fontSize:9, color:'#777'}}>{entrega.regiao}</span>
                                      </div>
                                  </div>
                              </a>
                          ))}
                      </div>
                  ) : (
                      <div style={{textAlign:'center', padding:40, color:'#aaa', fontSize:12}}>
                          Nenhuma entrega encontrada com esses filtros.
                      </div>
                  )}

                  {/* Gráfico de Barras por Área */}
                  {entregas.length > 0 && (
                      <div style={{borderTop:'1px solid #eee', marginTop:8, paddingTop:14}}>
                          <div className="section-label">Distribuição por área (total da base)</div>
                          <div style={{border:'1px solid #e5e4df', borderRadius:8, padding:14, background:'#fafaf7'}}>
                              {Object.entries(areaCounts).sort((a,b) => b[1]-a[1]).map(([area, count]) => (
                                  <div key={area} style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
                                      <span style={{fontSize:9, color:'#444', width:90, flexShrink:0}}>{area}</span>
                                      <div style={{flex:1, height:8, background:'#eee', borderRadius:4, overflow:'hidden'}}>
                                          <div style={{width:`${(count/maxCount)*100}%`, height:'100%', background: areaColors[area] || '#0278F8', borderRadius:4, transition:'width 0.5s'}}></div>
                                      </div>
                                      <span style={{fontSize:9, fontWeight:700, color:'#555', width:24, textAlign:'right'}}>{count}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          );
      }

      // 6. Integracao de Videos Youtube (API Apify)
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

  return (
    <>
      <main style={{width:'100%'}}>
        {parse(rawHTML, options)}
      </main>
      {chatOpen && <AIChatWidget onClose={() => setChatOpen(false)} />}
    </>
  );
}
