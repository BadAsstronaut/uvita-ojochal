/**
 * Path mapping between English and Spanish pages for language switching
 * This gets built at build time and injected into the JavaScript
 */
module.exports = {
  en_to_es: {
    '/': '/es/',
    '/about/': '/es/nosotros/',
    '/contact/': '/es/contacto/',
    '/contact/success/': '/es/contacto/exito/',
    '/recommendations/': '/es/recomendaciones/',
    '/recommendations/landscaping/': '/es/recomendaciones/paisajismo/',
    '/recommendations/uvita-mercado/': '/es/recommendations/uvita-mercado/',
    '/recommendations/uvita-mercado/la-finca-pz/': '/es/recommendations/uvita-mercado/la-finca-pz/',
    '/recommendations/uvita-mercado/nilson-jewelry/': '/es/recommendations/uvita-mercado/nilson-jewelry/',
    '/recommendations/uvita-mercado/mariscos-jomar/': '/es/recommendations/uvita-mercado/mariscos-jomar/'
  },
  
  es_to_en: {
    '/es/': '/',
    '/es/nosotros/': '/about/',
    '/es/contacto/': '/contact/',
    '/es/contacto/exito/': '/contact/success/',
    '/es/recomendaciones/': '/recommendations/',
    '/es/recomendaciones/paisajismo/': '/recommendations/landscaping/',
    '/es/recommendations/uvita-mercado/': '/recommendations/uvita-mercado/',
    '/es/recommendations/uvita-mercado/la-finca-pz/': '/recommendations/uvita-mercado/la-finca-pz/',
    '/es/recommendations/uvita-mercado/nilson-jewelry/': '/recommendations/uvita-mercado/nilson-jewelry/',
    '/es/recommendations/uvita-mercado/mariscos-jomar/': '/recommendations/uvita-mercado/mariscos-jomar/'
  }
}; 
