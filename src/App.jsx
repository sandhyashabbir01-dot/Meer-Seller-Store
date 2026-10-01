import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Admin from "./AdminPage";
import ProductReviews from "./ProductReviews";
const translations = {
  en: {
    nav: { categories: "Categories", home: "Home", newArrivals: "New Arrivals", indiaCollection: "India Collection", ukCollection: "UK Collection", allCategories: "All Categories", bestSellers: "Best Sellers", blogs: "Blogs" },
    categoryMenu: { fashion: "Fashion", jewellery: "Jewellery", bags: "Bags & Accessories", uk: "UK Collection", india: "India Collection" },
    topBar: { followUs: "Follow us", login: "Login", registration: "Registration" },
    announcement: { line1: "FREE WORLDWIDE SHIPPING ON ORDERS OVER $100", line2: "EXCLUSIVE INDIA & UK COLLECTIONS", line3: "SHOP PREMIUM • SHOP MEER" },
    search: { placeholder: "Search for products...", searchLabel: "Search", resultsKicker: "SEARCH", resultsHeading: "Search Results", found: "{count} product(s) found for \"{term}\"", notFound: "No products found for \"{term}\". Try another word.", clear: "← Clear Search" },
    header: { compare: "Compare", wishlist: "Wishlist", cart: "Cart" },
    hero: { shopNow: "SHOP NOW" },
    deal: { title: "Today's Deal", subtitle: "Limited time offers", specialOffer: "SPECIAL OFFER", newArrival: "NEW ARRIVAL", viewDeal: "View Deal →" },
    collectionStrip: { indiaTitle: "India Collection", indiaDesc: "Heritage & craftsmanship", ukTitle: "UK Collection", ukDesc: "Modern elegance", qualityTitle: "Premium Quality", qualityDesc: "Selected with care", secureTitle: "Secure Shopping", secureDesc: "Safe & reliable" },
    categoriesSection: { kicker: "EXPLORE MEER", heading: "Shop By Category", subtitle: "Discover our carefully selected collections.", explore: "Explore →" },
    luxury: { indiaKicker: "MEER HERITAGE", indiaHeading: "India Collection", indiaDesc: "Timeless heritage, refined craftsmanship and luxury inspired by India.", ukKicker: "MEER SIGNATURE", ukHeading: "UK Collection", ukDesc: "Modern elegance, sophisticated style and contemporary British luxury.", explore: "Explore Collection →" },
    back: { allCategories: "← Back to All Categories", bagsCategories: "← Back to Bags Categories", categories: "← Back to Categories" },
    bagsSection: { kicker: "BAGS & ACCESSORIES", heading: "Explore Categories", subtitle: "Choose a collection to explore our selected products." },
    productCard: { addToCart: "+ Add to Cart", shopNow: "SHOP NOW →", badgeNew: "NEW" },
    productDetail: { perPiece: "/ pc", shopNow: "SHOP NOW →", addWishlist: "♡ Add to Wishlist", inWishlist: "♥ In Wishlist", addCompare: "⇄ Add to Compare", inCompare: "⇄ In Compare" },
    cart: { title: "Shopping Cart", emptyTitle: "Your cart is empty", emptyText: "Add some products to your cart and they will appear here.", continueShopping: "Continue Shopping", total: "Total", proceedCheckout: "Proceed to Checkout", remove: "Remove" },
    wishlist: { title: "My Wishlist", emptyTitle: "Your wishlist is empty", emptyText: "Tap the heart on any product to save it here.", moveToCart: "Move to Cart", remove: "Remove" },
    compare: { title: "Compare Products", emptyTitle: "No products to compare", emptyText: "Tap the ⇄ icon on up to 3 products to compare them here.", product: "Product", name: "Name", price: "Price", category: "Category", details: "Details", addToCart: "Add to Cart", remove: "Remove" },
    checkout: { backToCart: "← Back to Cart", heading: "Complete Your Order", subtitle: "Please enter your details to continue with your purchase.", fullName: "Full Name", email: "Email Address", phone: "Phone Number", address: "Delivery Address", city: "City", placeName: "Enter your full name", placeEmail: "Enter your email", placePhone: "Enter your phone number", placeAddress: "Enter your complete delivery address", placeCity: "Your city", placeOrder: "Place Order", yourOrder: "Your Order", quantity: "Quantity", total: "Total" },
    orderSuccess: { thankYou: "Thank you", message: "Your order has been placed successfully.", orderId: "Order ID:", total: "Total:", continueShopping: "Continue Shopping" },
    newArrivals: { kicker: "JUST IN", heading: "New Arrivals", subtitle: "Our latest products from every collection." },
    bestSellers: { kicker: "TOP PICKS", heading: "Best Sellers", subtitle: "The most loved products picked by our customers." },
    blogs: { kicker: "MEER JOURNAL", heading: "Blogs", subtitle: "Style tips, buying guides and fashion inspiration." },
    common: { products: "Products" },
    sectionHeadings: {
      fashion: { kicker: "MEER COLLECTION", heading: "Fashion Products", subtitle: "Explore our latest fashion collection." },
      jewellery: { kicker: "MEER COLLECTION", heading: "Jewellery Products", subtitle: "Explore our elegant jewellery and luxury watch collection." },
      bags: { kicker: "BAGS & ACCESSORIES", subtitle: "Explore our selected {category} collection." },
      uk: { kicker: "UK EXCLUSIVE", heading: "UK Collection Products", subtitle: "Discover British heritage, modern fashion, and premium accessories." },
      india: { kicker: "INDIA HERITAGE", heading: "India Collection Products", subtitle: "Explore handcrafted traditional fashion and ethnic luxury inspired by India." },
    },
  },
  ur: {
    nav: { categories: "زمرہ جات", home: "ہوم", newArrivals: "نئی آمد", indiaCollection: "انڈیا کلیکشن", ukCollection: "یوکے کلیکشن", allCategories: "تمام زمرہ جات", bestSellers: "مقبول ترین", blogs: "بلاگز" },
    categoryMenu: { fashion: "فیشن", jewellery: "زیورات", bags: "بیگز اور لوازمات", uk: "یوکے کلیکشن", india: "انڈیا کلیکشن" },
    topBar: { followUs: "ہمیں فالو کریں", login: "لاگ ان", registration: "رجسٹریشن" },
    announcement: { line1: "$100 سے زائد آرڈر پر مفت عالمی شپنگ", line2: "خصوصی انڈیا اور یوکے کلیکشنز", line3: "پریمیم خریداری • شاپ میئر" },
    search: { placeholder: "مصنوعات تلاش کریں...", searchLabel: "تلاش", resultsKicker: "تلاش", resultsHeading: "تلاش کے نتائج", found: "\"{term}\" کے لیے {count} پروڈکٹس ملیں", notFound: "\"{term}\" کے لیے کوئی پروڈکٹ نہیں ملا۔ دوسرا لفظ آزمائیں۔", clear: "← تلاش صاف کریں" },
    header: { compare: "موازنہ", wishlist: "پسندیدہ", cart: "کارٹ" },
    hero: { shopNow: "ابھی خریدیں" },
    deal: { title: "آج کی پیشکش", subtitle: "محدود وقت کی پیشکش", specialOffer: "خصوصی پیشکش", newArrival: "نئی آمد", viewDeal: "پیشکش دیکھیں →" },
    collectionStrip: { indiaTitle: "انڈیا کلیکشن", indiaDesc: "ورثہ اور مہارت", ukTitle: "یوکے کلیکشن", ukDesc: "جدید خوبصورتی", qualityTitle: "اعلیٰ معیار", qualityDesc: "احتیاط سے منتخب", secureTitle: "محفوظ خریداری", secureDesc: "محفوظ اور قابل اعتماد" },
    categoriesSection: { kicker: "میئر دریافت کریں", heading: "زمرہ کے مطابق خریداری کریں", subtitle: "ہماری منتخب کردہ کلیکشنز دریافت کریں۔", explore: "دریافت کریں →" },
    luxury: { indiaKicker: "میئر ورثہ", indiaHeading: "انڈیا کلیکشن", indiaDesc: "لازوال ورثہ، بہترین مہارت اور انڈیا سے متاثر شاہانہ انداز۔", ukKicker: "میئر سگنیچر", ukHeading: "یوکے کلیکشن", ukDesc: "جدید خوبصورتی، شائستہ انداز اور برطانوی شان و شوکت۔", explore: "کلیکشن دیکھیں →" },
    back: { allCategories: "← تمام زمرہ جات کی طرف واپس", bagsCategories: "← بیگز کے زمرہ جات کی طرف واپس", categories: "← زمرہ جات کی طرف واپس" },
    bagsSection: { kicker: "بیگز اور لوازمات", heading: "زمرہ جات دریافت کریں", subtitle: "اپنی پسندیدہ مصنوعات دیکھنے کے لیے کلیکشن منتخب کریں۔" },
    productCard: { addToCart: "+ کارٹ میں شامل کریں", shopNow: "ابھی خریدیں →", badgeNew: "نیا" },
    productDetail: { perPiece: "/ عدد", shopNow: "ابھی خریدیں →", addWishlist: "♡ پسندیدہ میں شامل کریں", inWishlist: "♥ پسندیدہ میں شامل ہے", addCompare: "⇄ موازنہ میں شامل کریں", inCompare: "⇄ موازنہ میں شامل ہے" },
    cart: { title: "شاپنگ کارٹ", emptyTitle: "آپ کا کارٹ خالی ہے", emptyText: "کچھ مصنوعات کارٹ میں شامل کریں، وہ یہاں دکھائی دیں گی۔", continueShopping: "خریداری جاری رکھیں", total: "کل رقم", proceedCheckout: "چیک آؤٹ کی طرف بڑھیں", remove: "ہٹائیں" },
    wishlist: { title: "میری پسندیدہ فہرست", emptyTitle: "آپ کی پسندیدہ فہرست خالی ہے", emptyText: "کسی بھی پروڈکٹ کو محفوظ کرنے کے لیے دل کے نشان پر دبائیں۔", moveToCart: "کارٹ میں منتقل کریں", remove: "ہٹائیں" },
    compare: { title: "مصنوعات کا موازنہ", emptyTitle: "موازنے کے لیے کوئی پروڈکٹ نہیں", emptyText: "موازنہ کرنے کے لیے 3 مصنوعات تک ⇄ آئیکن دبائیں۔", product: "پروڈکٹ", name: "نام", price: "قیمت", category: "زمرہ", details: "تفصیلات", addToCart: "کارٹ میں شامل کریں", remove: "ہٹائیں" },
    checkout: { backToCart: "← کارٹ کی طرف واپس", heading: "اپنا آرڈر مکمل کریں", subtitle: "خریداری جاری رکھنے کے لیے اپنی تفصیلات درج کریں۔", fullName: "پورا نام", email: "ای میل ایڈریس", phone: "فون نمبر", address: "ڈیلیوری ایڈریس", city: "شہر", placeName: "اپنا پورا نام درج کریں", placeEmail: "اپنا ای میل درج کریں", placePhone: "اپنا فون نمبر درج کریں", placeAddress: "اپنا مکمل ڈیلیوری ایڈریس درج کریں", placeCity: "آپ کا شہر", placeOrder: "آرڈر دیں", yourOrder: "آپ کا آرڈر", quantity: "مقدار", total: "کل رقم" },
    orderSuccess: { thankYou: "شکریہ", message: "آپ کا آرڈر کامیابی سے موصول ہو گیا ہے۔", orderId: "آرڈر آئی ڈی:", total: "کل رقم:", continueShopping: "خریداری جاری رکھیں" },
    newArrivals: { kicker: "نئی آمد", heading: "نئی آمد", subtitle: "ہر کلیکشن کی تازہ ترین مصنوعات۔" },
    bestSellers: { kicker: "مقبول انتخاب", heading: "مقبول ترین", subtitle: "ہمارے گاہکوں کی منتخب کردہ مقبول ترین مصنوعات۔" },
    blogs: { kicker: "میئر جرنل", heading: "بلاگز", subtitle: "انداز کے مشورے، خریداری گائیڈز اور فیشن سے متاثر خیالات۔" },
    common: { products: "مصنوعات" },
    sectionHeadings: {
      fashion: { kicker: "میئر کلیکشن", heading: "فیشن کی مصنوعات", subtitle: "ہماری تازہ ترین فیشن کلیکشن دریافت کریں۔" },
      jewellery: { kicker: "میئر کلیکشن", heading: "زیورات کی مصنوعات", subtitle: "ہماری خوبصورت زیورات اور شاہانہ گھڑیوں کی کلیکشن دریافت کریں۔" },
      bags: { kicker: "بیگز اور لوازمات", subtitle: "ہماری منتخب کردہ {category} کلیکشن دریافت کریں۔" },
      uk: { kicker: "یوکے خصوصی", heading: "یوکے کلیکشن کی مصنوعات", subtitle: "برطانوی ورثہ، جدید فیشن اور اعلیٰ لوازمات دریافت کریں۔" },
      india: { kicker: "انڈیا ورثہ", heading: "انڈیا کلیکشن کی مصنوعات", subtitle: "انڈیا سے متاثر روایتی فیشن اور نسلی شان و شوکت دریافت کریں۔" },
    },
  },
  ar: {
    nav: { categories: "الفئات", home: "الرئيسية", newArrivals: "وصل حديثاً", indiaCollection: "مجموعة الهند", ukCollection: "مجموعة بريطانيا", allCategories: "جميع الفئات", bestSellers: "الأكثر مبيعاً", blogs: "المدونة" },
    categoryMenu: { fashion: "الأزياء", jewellery: "المجوهرات", bags: "الحقائب والإكسسوارات", uk: "مجموعة بريطانيا", india: "مجموعة الهند" },
    topBar: { followUs: "تابعنا", login: "تسجيل الدخول", registration: "إنشاء حساب" },
    announcement: { line1: "شحن مجاني حول العالم للطلبات فوق 100 دولار", line2: "مجموعات حصرية من الهند وبريطانيا", line3: "تسوق المنتجات الفاخرة • تسوق مير" },
    search: { placeholder: "ابحث عن المنتجات...", searchLabel: "بحث", resultsKicker: "بحث", resultsHeading: "نتائج البحث", found: "تم العثور على {count} منتج لـ \"{term}\"", notFound: "لم يتم العثور على منتجات لـ \"{term}\". جرّب كلمة أخرى.", clear: "← مسح البحث" },
    header: { compare: "مقارنة", wishlist: "المفضلة", cart: "السلة" },
    hero: { shopNow: "تسوق الآن" },
    deal: { title: "عرض اليوم", subtitle: "عروض لوقت محدود", specialOffer: "عرض خاص", newArrival: "وصل حديثاً", viewDeal: "عرض الصفقة →" },
    collectionStrip: { indiaTitle: "مجموعة الهند", indiaDesc: "تراث وحرفية", ukTitle: "مجموعة بريطانيا", ukDesc: "أناقة عصرية", qualityTitle: "جودة عالية", qualityDesc: "مختارة بعناية", secureTitle: "تسوق آمن", secureDesc: "آمن وموثوق" },
    categoriesSection: { kicker: "اكتشف مير", heading: "تسوق حسب الفئة", subtitle: "اكتشف مجموعاتنا المختارة بعناية.", explore: "استكشف →" },
    luxury: { indiaKicker: "تراث مير", indiaHeading: "مجموعة الهند", indiaDesc: "تراث خالد، حرفية راقية وفخامة مستوحاة من الهند.", ukKicker: "توقيع مير", ukHeading: "مجموعة بريطانيا", ukDesc: "أناقة عصرية، أسلوب راقٍ وفخامة بريطانية معاصرة.", explore: "استكشف المجموعة →" },
    back: { allCategories: "← العودة إلى جميع الفئات", bagsCategories: "← العودة إلى فئات الحقائب", categories: "← العودة إلى الفئات" },
    bagsSection: { kicker: "الحقائب والإكسسوارات", heading: "استكشف الفئات", subtitle: "اختر مجموعة لاستكشاف منتجاتنا المختارة." },
    productCard: { addToCart: "+ أضف إلى السلة", shopNow: "تسوق الآن →", badgeNew: "جديد" },
    productDetail: { perPiece: "/ للقطعة", shopNow: "تسوق الآن →", addWishlist: "♡ أضف إلى المفضلة", inWishlist: "♥ في المفضلة", addCompare: "⇄ أضف للمقارنة", inCompare: "⇄ في المقارنة" },
    cart: { title: "سلة التسوق", emptyTitle: "سلتك فارغة", emptyText: "أضف بعض المنتجات إلى سلتك وستظهر هنا.", continueShopping: "متابعة التسوق", total: "الإجمالي", proceedCheckout: "إتمام الشراء", remove: "إزالة" },
    wishlist: { title: "قائمة رغباتي", emptyTitle: "قائمة رغباتك فارغة", emptyText: "اضغط على القلب في أي منتج لحفظه هنا.", moveToCart: "نقل إلى السلة", remove: "إزالة" },
    compare: { title: "مقارنة المنتجات", emptyTitle: "لا توجد منتجات للمقارنة", emptyText: "اضغط على أيقونة ⇄ لمقارنة حتى 3 منتجات هنا.", product: "المنتج", name: "الاسم", price: "السعر", category: "الفئة", details: "التفاصيل", addToCart: "أضف إلى السلة", remove: "إزالة" },
    checkout: { backToCart: "← العودة إلى السلة", heading: "أكمل طلبك", subtitle: "يرجى إدخال بياناتك لمتابعة عملية الشراء.", fullName: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف", address: "عنوان التوصيل", city: "المدينة", placeName: "أدخل اسمك الكامل", placeEmail: "أدخل بريدك الإلكتروني", placePhone: "أدخل رقم هاتفك", placeAddress: "أدخل عنوان التوصيل الكامل", placeCity: "مدينتك", placeOrder: "إتمام الطلب", yourOrder: "طلبك", quantity: "الكمية", total: "الإجمالي" },
    orderSuccess: { thankYou: "شكراً لك", message: "تم استلام طلبك بنجاح.", orderId: "رقم الطلب:", total: "الإجمالي:", continueShopping: "متابعة التسوق" },
    newArrivals: { kicker: "وصل حديثاً", heading: "وصل حديثاً", subtitle: "أحدث منتجاتنا من كل مجموعة." },
    bestSellers: { kicker: "الأفضل اختياراً", heading: "الأكثر مبيعاً", subtitle: "المنتجات الأكثر تفضيلاً لدى عملائنا." },
    blogs: { kicker: "مجلة مير", heading: "المدونة", subtitle: "نصائح أناقة، أدلة شراء وإلهام في عالم الموضة." },
    common: { products: "منتجات" },
    sectionHeadings: {
      fashion: { kicker: "مجموعة مير", heading: "منتجات الأزياء", subtitle: "اكتشف أحدث مجموعتنا من الأزياء." },
      jewellery: { kicker: "مجموعة مير", heading: "منتجات المجوهرات", subtitle: "اكتشف مجموعتنا الأنيقة من المجوهرات والساعات الفاخرة." },
      bags: { kicker: "الحقائب والإكسسوارات", subtitle: "اكتشف مجموعتنا المختارة من {category}." },
      uk: { kicker: "حصري بريطاني", heading: "منتجات مجموعة بريطانيا", subtitle: "اكتشف التراث البريطاني والأزياء العصرية والإكسسوارات الفاخرة." },
      india: { kicker: "تراث الهند", heading: "منتجات مجموعة الهند", subtitle: "اكتشف الأزياء التقليدية المصنوعة يدوياً والفخامة العرقية المستوحاة من الهند." },
    },
  },
  fr: {
    nav: { categories: "Catégories", home: "Accueil", newArrivals: "Nouveautés", indiaCollection: "Collection Inde", ukCollection: "Collection UK", allCategories: "Toutes les catégories", bestSellers: "Meilleures ventes", blogs: "Blogs" },
    categoryMenu: { fashion: "Mode", jewellery: "Bijoux", bags: "Sacs et accessoires", uk: "Collection UK", india: "Collection Inde" },
    topBar: { followUs: "Suivez-nous", login: "Connexion", registration: "Inscription" },
    announcement: { line1: "LIVRAISON MONDIALE GRATUITE DÈS 100 $ D'ACHAT", line2: "COLLECTIONS EXCLUSIVES INDE ET UK", line3: "ACHETEZ DU PREMIUM • ACHETEZ MEER" },
    search: { placeholder: "Rechercher des produits...", searchLabel: "Rechercher", resultsKicker: "RECHERCHE", resultsHeading: "Résultats de recherche", found: "{count} produit(s) trouvé(s) pour \"{term}\"", notFound: "Aucun produit trouvé pour \"{term}\". Essayez un autre mot.", clear: "← Effacer la recherche" },
    header: { compare: "Comparer", wishlist: "Favoris", cart: "Panier" },
    hero: { shopNow: "ACHETER" },
    deal: { title: "Offre du jour", subtitle: "Offres à durée limitée", specialOffer: "OFFRE SPÉCIALE", newArrival: "NOUVEAUTÉ", viewDeal: "Voir l'offre →" },
    collectionStrip: { indiaTitle: "Collection Inde", indiaDesc: "Héritage et savoir-faire", ukTitle: "Collection UK", ukDesc: "Élégance moderne", qualityTitle: "Qualité premium", qualityDesc: "Sélectionné avec soin", secureTitle: "Achat sécurisé", secureDesc: "Sûr et fiable" },
    categoriesSection: { kicker: "DÉCOUVRIR MEER", heading: "Achetez par catégorie", subtitle: "Découvrez nos collections soigneusement sélectionnées.", explore: "Découvrir →" },
    luxury: { indiaKicker: "HÉRITAGE MEER", indiaHeading: "Collection Inde", indiaDesc: "Héritage intemporel, savoir-faire raffiné et luxe inspiré de l'Inde.", ukKicker: "SIGNATURE MEER", ukHeading: "Collection UK", ukDesc: "Élégance moderne, style sophistiqué et luxe britannique contemporain.", explore: "Découvrir la collection →" },
    back: { allCategories: "← Retour à toutes les catégories", bagsCategories: "← Retour aux catégories de sacs", categories: "← Retour aux catégories" },
    bagsSection: { kicker: "SACS ET ACCESSOIRES", heading: "Explorez les catégories", subtitle: "Choisissez une collection pour explorer nos produits sélectionnés." },
    productCard: { addToCart: "+ Ajouter au panier", shopNow: "ACHETER →", badgeNew: "NOUVEAU" },
    productDetail: { perPiece: "/ pièce", shopNow: "ACHETER →", addWishlist: "♡ Ajouter aux favoris", inWishlist: "♥ Dans les favoris", addCompare: "⇄ Ajouter à comparer", inCompare: "⇄ Dans la comparaison" },
    cart: { title: "Panier", emptyTitle: "Votre panier est vide", emptyText: "Ajoutez des produits à votre panier, ils apparaîtront ici.", continueShopping: "Continuer les achats", total: "Total", proceedCheckout: "Passer à la caisse", remove: "Retirer" },
    wishlist: { title: "Ma liste de favoris", emptyTitle: "Votre liste de favoris est vide", emptyText: "Appuyez sur le cœur d'un produit pour l'enregistrer ici.", moveToCart: "Déplacer vers le panier", remove: "Retirer" },
    compare: { title: "Comparer les produits", emptyTitle: "Aucun produit à comparer", emptyText: "Appuyez sur l'icône ⇄ sur jusqu'à 3 produits pour les comparer ici.", product: "Produit", name: "Nom", price: "Prix", category: "Catégorie", details: "Détails", addToCart: "Ajouter au panier", remove: "Retirer" },
    checkout: { backToCart: "← Retour au panier", heading: "Finalisez votre commande", subtitle: "Veuillez saisir vos informations pour poursuivre votre achat.", fullName: "Nom complet", email: "Adresse e-mail", phone: "Numéro de téléphone", address: "Adresse de livraison", city: "Ville", placeName: "Entrez votre nom complet", placeEmail: "Entrez votre e-mail", placePhone: "Entrez votre numéro de téléphone", placeAddress: "Entrez votre adresse de livraison complète", placeCity: "Votre ville", placeOrder: "Passer la commande", yourOrder: "Votre commande", quantity: "Quantité", total: "Total" },
    orderSuccess: { thankYou: "Merci", message: "Votre commande a été passée avec succès.", orderId: "N° de commande :", total: "Total :", continueShopping: "Continuer les achats" },
    newArrivals: { kicker: "NOUVEAUTÉS", heading: "Nouveautés", subtitle: "Nos derniers produits de chaque collection." },
    bestSellers: { kicker: "MEILLEURS CHOIX", heading: "Meilleures ventes", subtitle: "Les produits préférés de nos clients." },
    blogs: { kicker: "JOURNAL MEER", heading: "Blogs", subtitle: "Conseils de style, guides d'achat et inspiration mode." },
    common: { products: "Produits" },
    sectionHeadings: {
      fashion: { kicker: "COLLECTION MEER", heading: "Produits de mode", subtitle: "Découvrez notre dernière collection de mode." },
      jewellery: { kicker: "COLLECTION MEER", heading: "Produits de bijouterie", subtitle: "Découvrez notre élégante collection de bijoux et de montres de luxe." },
      bags: { kicker: "SACS ET ACCESSOIRES", subtitle: "Découvrez notre collection sélectionnée de {category}." },
      uk: { kicker: "EXCLUSIVITÉ UK", heading: "Produits de la collection UK", subtitle: "Découvrez l'héritage britannique, la mode moderne et les accessoires premium." },
      india: { kicker: "HÉRITAGE INDE", heading: "Produits de la collection Inde", subtitle: "Découvrez la mode traditionnelle artisanale et le luxe ethnique inspiré de l'Inde." },
    },
  },
  es: {
    nav: { categories: "Categorías", home: "Inicio", newArrivals: "Novedades", indiaCollection: "Colección India", ukCollection: "Colección UK", allCategories: "Todas las categorías", bestSellers: "Más vendidos", blogs: "Blogs" },
    categoryMenu: { fashion: "Moda", jewellery: "Joyería", bags: "Bolsos y accesorios", uk: "Colección UK", india: "Colección India" },
    topBar: { followUs: "Síguenos", login: "Iniciar sesión", registration: "Registro" },
    announcement: { line1: "ENVÍO MUNDIAL GRATIS EN PEDIDOS SUPERIORES A $100", line2: "COLECCIONES EXCLUSIVAS DE INDIA Y UK", line3: "COMPRA PREMIUM • COMPRA MEER" },
    search: { placeholder: "Buscar productos...", searchLabel: "Buscar", resultsKicker: "BÚSQUEDA", resultsHeading: "Resultados de búsqueda", found: "{count} producto(s) encontrados para \"{term}\"", notFound: "No se encontraron productos para \"{term}\". Prueba otra palabra.", clear: "← Borrar búsqueda" },
    header: { compare: "Comparar", wishlist: "Favoritos", cart: "Carrito" },
    hero: { shopNow: "COMPRAR AHORA" },
    deal: { title: "Oferta del día", subtitle: "Ofertas por tiempo limitado", specialOffer: "OFERTA ESPECIAL", newArrival: "NOVEDAD", viewDeal: "Ver oferta →" },
    collectionStrip: { indiaTitle: "Colección India", indiaDesc: "Herencia y artesanía", ukTitle: "Colección UK", ukDesc: "Elegancia moderna", qualityTitle: "Calidad premium", qualityDesc: "Seleccionado con cuidado", secureTitle: "Compra segura", secureDesc: "Seguro y confiable" },
    categoriesSection: { kicker: "EXPLORA MEER", heading: "Compra por categoría", subtitle: "Descubre nuestras colecciones cuidadosamente seleccionadas.", explore: "Explorar →" },
    luxury: { indiaKicker: "HERENCIA MEER", indiaHeading: "Colección India", indiaDesc: "Herencia atemporal, artesanía refinada y lujo inspirado en la India.", ukKicker: "FIRMA MEER", ukHeading: "Colección UK", ukDesc: "Elegancia moderna, estilo sofisticado y lujo británico contemporáneo.", explore: "Explorar colección →" },
    back: { allCategories: "← Volver a todas las categorías", bagsCategories: "← Volver a categorías de bolsos", categories: "← Volver a categorías" },
    bagsSection: { kicker: "BOLSOS Y ACCESORIOS", heading: "Explora categorías", subtitle: "Elige una colección para explorar nuestros productos seleccionados." },
    productCard: { addToCart: "+ Añadir al carrito", shopNow: "COMPRAR AHORA →", badgeNew: "NUEVO" },
    productDetail: { perPiece: "/ unidad", shopNow: "COMPRAR AHORA →", addWishlist: "♡ Añadir a favoritos", inWishlist: "♥ En favoritos", addCompare: "⇄ Añadir a comparar", inCompare: "⇄ En comparación" },
    cart: { title: "Carrito de compras", emptyTitle: "Tu carrito está vacío", emptyText: "Añade productos a tu carrito y aparecerán aquí.", continueShopping: "Seguir comprando", total: "Total", proceedCheckout: "Proceder al pago", remove: "Eliminar" },
    wishlist: { title: "Mi lista de deseos", emptyTitle: "Tu lista de deseos está vacía", emptyText: "Toca el corazón en cualquier producto para guardarlo aquí.", moveToCart: "Mover al carrito", remove: "Eliminar" },
    compare: { title: "Comparar productos", emptyTitle: "No hay productos para comparar", emptyText: "Toca el ícono ⇄ en hasta 3 productos para compararlos aquí.", product: "Producto", name: "Nombre", price: "Precio", category: "Categoría", details: "Detalles", addToCart: "Añadir al carrito", remove: "Eliminar" },
    checkout: { backToCart: "← Volver al carrito", heading: "Completa tu pedido", subtitle: "Ingresa tus datos para continuar con tu compra.", fullName: "Nombre completo", email: "Correo electrónico", phone: "Número de teléfono", address: "Dirección de entrega", city: "Ciudad", placeName: "Ingresa tu nombre completo", placeEmail: "Ingresa tu correo electrónico", placePhone: "Ingresa tu número de teléfono", placeAddress: "Ingresa tu dirección de entrega completa", placeCity: "Tu ciudad", placeOrder: "Realizar pedido", yourOrder: "Tu pedido", quantity: "Cantidad", total: "Total" },
    orderSuccess: { thankYou: "Gracias", message: "Tu pedido se ha realizado con éxito.", orderId: "ID de pedido:", total: "Total:", continueShopping: "Seguir comprando" },
    newArrivals: { kicker: "RECIÉN LLEGADOS", heading: "Novedades", subtitle: "Nuestros productos más nuevos de cada colección." },
    bestSellers: { kicker: "LO MÁS ELEGIDO", heading: "Más vendidos", subtitle: "Los productos favoritos de nuestros clientes." },
    blogs: { kicker: "REVISTA MEER", heading: "Blogs", subtitle: "Consejos de estilo, guías de compra e inspiración de moda." },
    common: { products: "Productos" },
    sectionHeadings: {
      fashion: { kicker: "COLECCIÓN MEER", heading: "Productos de moda", subtitle: "Descubre nuestra última colección de moda." },
      jewellery: { kicker: "COLECCIÓN MEER", heading: "Productos de joyería", subtitle: "Descubre nuestra elegante colección de joyas y relojes de lujo." },
      bags: { kicker: "BOLSOS Y ACCESORIOS", subtitle: "Descubre nuestra colección seleccionada de {category}." },
      uk: { kicker: "EXCLUSIVO UK", heading: "Productos de la colección UK", subtitle: "Descubre la herencia británica, la moda moderna y los accesorios premium." },
      india: { kicker: "HERENCIA DE INDIA", heading: "Productos de la colección India", subtitle: "Descubre la moda tradicional artesanal y el lujo étnico inspirado en la India." },
    },
  },
  de: {
    nav: { categories: "Kategorien", home: "Startseite", newArrivals: "Neuheiten", indiaCollection: "Indien-Kollektion", ukCollection: "UK-Kollektion", allCategories: "Alle Kategorien", bestSellers: "Bestseller", blogs: "Blogs" },
    categoryMenu: { fashion: "Mode", jewellery: "Schmuck", bags: "Taschen & Accessoires", uk: "UK-Kollektion", india: "Indien-Kollektion" },
    topBar: { followUs: "Folgen Sie uns", login: "Anmelden", registration: "Registrieren" },
    announcement: { line1: "KOSTENLOSER WELTWEITER VERSAND AB 100 $ BESTELLWERT", line2: "EXKLUSIVE INDIEN- & UK-KOLLEKTIONEN", line3: "PREMIUM EINKAUFEN • MEER EINKAUFEN" },
    search: { placeholder: "Produkte suchen...", searchLabel: "Suchen", resultsKicker: "SUCHE", resultsHeading: "Suchergebnisse", found: "{count} Produkt(e) gefunden für \"{term}\"", notFound: "Keine Produkte gefunden für \"{term}\". Versuchen Sie ein anderes Wort.", clear: "← Suche löschen" },
    header: { compare: "Vergleichen", wishlist: "Wunschliste", cart: "Warenkorb" },
    hero: { shopNow: "JETZT KAUFEN" },
    deal: { title: "Angebot des Tages", subtitle: "Zeitlich begrenzte Angebote", specialOffer: "SONDERANGEBOT", newArrival: "NEUHEIT", viewDeal: "Angebot ansehen →" },
    collectionStrip: { indiaTitle: "Indien-Kollektion", indiaDesc: "Erbe & Handwerkskunst", ukTitle: "UK-Kollektion", ukDesc: "Moderne Eleganz", qualityTitle: "Premium-Qualität", qualityDesc: "Sorgfältig ausgewählt", secureTitle: "Sicher einkaufen", secureDesc: "Sicher & zuverlässig" },
    categoriesSection: { kicker: "MEER ENTDECKEN", heading: "Nach Kategorie einkaufen", subtitle: "Entdecken Sie unsere sorgfältig ausgewählten Kollektionen.", explore: "Entdecken →" },
    luxury: { indiaKicker: "MEER ERBE", indiaHeading: "Indien-Kollektion", indiaDesc: "Zeitloses Erbe, feine Handwerkskunst und von Indien inspirierter Luxus.", ukKicker: "MEER SIGNATURE", ukHeading: "UK-Kollektion", ukDesc: "Moderne Eleganz, raffinierter Stil und zeitgenössischer britischer Luxus.", explore: "Kollektion entdecken →" },
    back: { allCategories: "← Zurück zu allen Kategorien", bagsCategories: "← Zurück zu Taschenkategorien", categories: "← Zurück zu Kategorien" },
    bagsSection: { kicker: "TASCHEN & ACCESSOIRES", heading: "Kategorien entdecken", subtitle: "Wählen Sie eine Kollektion, um unsere ausgewählten Produkte zu entdecken." },
    productCard: { addToCart: "+ In den Warenkorb", shopNow: "JETZT KAUFEN →", badgeNew: "NEU" },
    productDetail: { perPiece: "/ Stück", shopNow: "JETZT KAUFEN →", addWishlist: "♡ Zur Wunschliste hinzufügen", inWishlist: "♥ In der Wunschliste", addCompare: "⇄ Zum Vergleich hinzufügen", inCompare: "⇄ Im Vergleich" },
    cart: { title: "Warenkorb", emptyTitle: "Ihr Warenkorb ist leer", emptyText: "Fügen Sie Produkte zu Ihrem Warenkorb hinzu, sie erscheinen hier.", continueShopping: "Weiter einkaufen", total: "Gesamt", proceedCheckout: "Zur Kasse gehen", remove: "Entfernen" },
    wishlist: { title: "Meine Wunschliste", emptyTitle: "Ihre Wunschliste ist leer", emptyText: "Tippen Sie auf das Herz bei einem Produkt, um es hier zu speichern.", moveToCart: "In den Warenkorb verschieben", remove: "Entfernen" },
    compare: { title: "Produkte vergleichen", emptyTitle: "Keine Produkte zum Vergleichen", emptyText: "Tippen Sie auf das ⇄-Symbol bei bis zu 3 Produkten, um sie hier zu vergleichen.", product: "Produkt", name: "Name", price: "Preis", category: "Kategorie", details: "Details", addToCart: "In den Warenkorb", remove: "Entfernen" },
    checkout: { backToCart: "← Zurück zum Warenkorb", heading: "Bestellung abschließen", subtitle: "Bitte geben Sie Ihre Daten ein, um mit dem Kauf fortzufahren.", fullName: "Vollständiger Name", email: "E-Mail-Adresse", phone: "Telefonnummer", address: "Lieferadresse", city: "Stadt", placeName: "Geben Sie Ihren vollständigen Namen ein", placeEmail: "Geben Sie Ihre E-Mail ein", placePhone: "Geben Sie Ihre Telefonnummer ein", placeAddress: "Geben Sie Ihre vollständige Lieferadresse ein", placeCity: "Ihre Stadt", placeOrder: "Bestellung aufgeben", yourOrder: "Ihre Bestellung", quantity: "Menge", total: "Gesamt" },
    orderSuccess: { thankYou: "Vielen Dank", message: "Ihre Bestellung wurde erfolgreich aufgegeben.", orderId: "Bestellnummer:", total: "Gesamt:", continueShopping: "Weiter einkaufen" },
    newArrivals: { kicker: "NEU EINGETROFFEN", heading: "Neuheiten", subtitle: "Unsere neuesten Produkte aus jeder Kollektion." },
    bestSellers: { kicker: "TOP-AUSWAHL", heading: "Bestseller", subtitle: "Die beliebtesten Produkte unserer Kunden." },
    blogs: { kicker: "MEER JOURNAL", heading: "Blogs", subtitle: "Stiltipps, Kaufratgeber und Mode-Inspiration." },
    common: { products: "Produkte" },
    sectionHeadings: {
      fashion: { kicker: "MEER KOLLEKTION", heading: "Modeprodukte", subtitle: "Entdecken Sie unsere neueste Modekollektion." },
      jewellery: { kicker: "MEER KOLLEKTION", heading: "Schmuckprodukte", subtitle: "Entdecken Sie unsere elegante Schmuck- und Luxusuhrenkollektion." },
      bags: { kicker: "TASCHEN & ACCESSOIRES", subtitle: "Entdecken Sie unsere ausgewählte {category}-Kollektion." },
      uk: { kicker: "UK EXKLUSIV", heading: "Produkte der UK-Kollektion", subtitle: "Entdecken Sie britisches Erbe, moderne Mode und Premium-Accessoires." },
      india: { kicker: "INDIEN ERBE", heading: "Produkte der Indien-Kollektion", subtitle: "Entdecken Sie handgefertigte traditionelle Mode und von Indien inspirierten ethnischen Luxus." },
    },
  },
  hi: {
    nav: { categories: "श्रेणियाँ", home: "होम", newArrivals: "नई आवक", indiaCollection: "इंडिया कलेक्शन", ukCollection: "यूके कलेक्शन", allCategories: "सभी श्रेणियाँ", bestSellers: "बेस्ट सेलर्स", blogs: "ब्लॉग्स" },
    categoryMenu: { fashion: "फैशन", jewellery: "ज्वेलरी", bags: "बैग्स और एक्सेसरीज़", uk: "यूके कलेक्शन", india: "इंडिया कलेक्शन" },
    topBar: { followUs: "हमें फॉलो करें", login: "लॉगिन", registration: "रजिस्ट्रेशन" },
    announcement: { line1: "$100 से अधिक के ऑर्डर पर मुफ्त विश्वव्यापी शिपिंग", line2: "विशेष इंडिया और यूके कलेक्शन", line3: "प्रीमियम खरीदें • मीर से खरीदें" },
    search: { placeholder: "उत्पाद खोजें...", searchLabel: "खोजें", resultsKicker: "खोज", resultsHeading: "खोज परिणाम", found: "\"{term}\" के लिए {count} उत्पाद मिले", notFound: "\"{term}\" के लिए कोई उत्पाद नहीं मिला। कोई और शब्द आज़माएं।", clear: "← खोज साफ़ करें" },
    header: { compare: "तुलना", wishlist: "विशलिस्ट", cart: "कार्ट" },
    hero: { shopNow: "अभी खरीदें" },
    deal: { title: "आज का सौदा", subtitle: "सीमित समय की पेशकश", specialOffer: "विशेष ऑफर", newArrival: "नई आवक", viewDeal: "सौदा देखें →" },
    collectionStrip: { indiaTitle: "इंडिया कलेक्शन", indiaDesc: "विरासत और शिल्पकला", ukTitle: "यूके कलेक्शन", ukDesc: "आधुनिक शान", qualityTitle: "प्रीमियम गुणवत्ता", qualityDesc: "सावधानी से चयनित", secureTitle: "सुरक्षित खरीदारी", secureDesc: "सुरक्षित और भरोसेमंद" },
    categoriesSection: { kicker: "मीर एक्सप्लोर करें", heading: "श्रेणी अनुसार खरीदें", subtitle: "हमारे सावधानी से चुने गए कलेक्शन देखें।", explore: "एक्सप्लोर करें →" },
    luxury: { indiaKicker: "मीर विरासत", indiaHeading: "इंडिया कलेक्शन", indiaDesc: "कालातीत विरासत, उत्कृष्ट शिल्पकला और भारत से प्रेरित विलासिता।", ukKicker: "मीर सिग्नेचर", ukHeading: "यूके कलेक्शन", ukDesc: "आधुनिक शान, परिष्कृत शैली और समकालीन ब्रिटिश विलासिता।", explore: "कलेक्शन देखें →" },
    back: { allCategories: "← सभी श्रेणियों पर वापस जाएं", bagsCategories: "← बैग्स श्रेणियों पर वापस जाएं", categories: "← श्रेणियों पर वापस जाएं" },
    bagsSection: { kicker: "बैग्स और एक्सेसरीज़", heading: "श्रेणियाँ एक्सप्लोर करें", subtitle: "हमारे चुनिंदा उत्पाद देखने के लिए एक कलेक्शन चुनें।" },
    productCard: { addToCart: "+ कार्ट में डालें", shopNow: "अभी खरीदें →", badgeNew: "नया" },
    productDetail: { perPiece: "/ पीस", shopNow: "अभी खरीदें →", addWishlist: "♡ विशलिस्ट में जोड़ें", inWishlist: "♥ विशलिस्ट में है", addCompare: "⇄ तुलना में जोड़ें", inCompare: "⇄ तुलना में है" },
    cart: { title: "शॉपिंग कार्ट", emptyTitle: "आपकी कार्ट खाली है", emptyText: "अपनी कार्ट में कुछ उत्पाद जोड़ें, वे यहाँ दिखेंगे।", continueShopping: "खरीदारी जारी रखें", total: "कुल", proceedCheckout: "चेकआउट पर जाएं", remove: "हटाएं" },
    wishlist: { title: "मेरी विशलिस्ट", emptyTitle: "आपकी विशलिस्ट खाली है", emptyText: "किसी उत्पाद को यहाँ सेव करने के लिए दिल के निशान पर टैप करें।", moveToCart: "कार्ट में ले जाएं", remove: "हटाएं" },
    compare: { title: "उत्पादों की तुलना करें", emptyTitle: "तुलना के लिए कोई उत्पाद नहीं", emptyText: "यहाँ तुलना करने के लिए 3 उत्पादों तक ⇄ आइकन पर टैप करें।", product: "उत्पाद", name: "नाम", price: "कीमत", category: "श्रेणी", details: "विवरण", addToCart: "कार्ट में डालें", remove: "हटाएं" },
    checkout: { backToCart: "← कार्ट पर वापस जाएं", heading: "अपना ऑर्डर पूरा करें", subtitle: "खरीदारी जारी रखने के लिए कृपया अपनी जानकारी दर्ज करें।", fullName: "पूरा नाम", email: "ईमेल पता", phone: "फोन नंबर", address: "डिलीवरी पता", city: "शहर", placeName: "अपना पूरा नाम दर्ज करें", placeEmail: "अपना ईमेल दर्ज करें", placePhone: "अपना फोन नंबर दर्ज करें", placeAddress: "अपना पूरा डिलीवरी पता दर्ज करें", placeCity: "आपका शहर", placeOrder: "ऑर्डर करें", yourOrder: "आपका ऑर्डर", quantity: "मात्रा", total: "कुल" },
    orderSuccess: { thankYou: "धन्यवाद", message: "आपका ऑर्डर सफलतापूर्वक हो गया है।", orderId: "ऑर्डर आईडी:", total: "कुल:", continueShopping: "खरीदारी जारी रखें" },
    newArrivals: { kicker: "अभी-अभी आया", heading: "नई आवक", subtitle: "हर कलेक्शन से हमारे नवीनतम उत्पाद।" },
    bestSellers: { kicker: "टॉप पिक्स", heading: "बेस्ट सेलर्स", subtitle: "हमारे ग्राहकों द्वारा चुने गए सबसे पसंदीदा उत्पाद।" },
    blogs: { kicker: "मीर जर्नल", heading: "ब्लॉग्स", subtitle: "स्टाइल टिप्स, खरीदारी गाइड और फैशन प्रेरणा।" },
    common: { products: "उत्पाद" },
    sectionHeadings: {
      fashion: { kicker: "मीर कलेक्शन", heading: "फैशन उत्पाद", subtitle: "हमारा नवीनतम फैशन कलेक्शन देखें।" },
      jewellery: { kicker: "मीर कलेक्शन", heading: "ज्वेलरी उत्पाद", subtitle: "हमारा सुंदर ज्वेलरी और लक्ज़री वॉच कलेक्शन देखें।" },
      bags: { kicker: "बैग्स और एक्सेसरीज़", subtitle: "हमारा चुनिंदा {category} कलेक्शन देखें।" },
      uk: { kicker: "यूके एक्सक्लूसिव", heading: "यूके कलेक्शन उत्पाद", subtitle: "ब्रिटिश विरासत, आधुनिक फैशन और प्रीमियम एक्सेसरीज़ देखें।" },
      india: { kicker: "इंडिया विरासत", heading: "इंडिया कलेक्शन उत्पाद", subtitle: "हस्तशिल्प पारंपरिक फैशन और भारत से प्रेरित एथनिक लक्ज़री देखें।" },
    },
  },
  zh: {
    nav: { categories: "分类", home: "首页", newArrivals: "新品上市", indiaCollection: "印度系列", ukCollection: "英国系列", allCategories: "所有分类", bestSellers: "畅销产品", blogs: "博客" },
    categoryMenu: { fashion: "时尚", jewellery: "珠宝", bags: "包袋配饰", uk: "英国系列", india: "印度系列" },
    topBar: { followUs: "关注我们", login: "登录", registration: "注册" },
    announcement: { line1: "订单满100美元享全球免运费", line2: "印度与英国独家系列", line3: "精选优质好物 • 尽在MEER" },
    search: { placeholder: "搜索产品...", searchLabel: "搜索", resultsKicker: "搜索", resultsHeading: "搜索结果", found: "找到 {count} 件与\"{term}\"相关的产品", notFound: "未找到与\"{term}\"相关的产品，请尝试其他关键词。", clear: "← 清除搜索" },
    header: { compare: "对比", wishlist: "收藏夹", cart: "购物车" },
    hero: { shopNow: "立即购买" },
    deal: { title: "今日特惠", subtitle: "限时优惠", specialOffer: "特别优惠", newArrival: "新品上市", viewDeal: "查看优惠 →" },
    collectionStrip: { indiaTitle: "印度系列", indiaDesc: "传承与匠心", ukTitle: "英国系列", ukDesc: "现代优雅", qualityTitle: "优质保证", qualityDesc: "精心甄选", secureTitle: "安全购物", secureDesc: "安全可靠" },
    categoriesSection: { kicker: "探索MEER", heading: "按分类购物", subtitle: "探索我们精心挑选的系列产品。", explore: "探索 →" },
    luxury: { indiaKicker: "MEER传承", indiaHeading: "印度系列", indiaDesc: "永恒的传承、精湛的工艺，以及源自印度灵感的奢华。", ukKicker: "MEER签名系列", ukHeading: "英国系列", ukDesc: "现代优雅、精致风格与当代英伦奢华。", explore: "探索系列 →" },
    back: { allCategories: "← 返回所有分类", bagsCategories: "← 返回包袋分类", categories: "← 返回分类" },
    bagsSection: { kicker: "包袋配饰", heading: "探索分类", subtitle: "选择一个系列，浏览我们精选的产品。" },
    productCard: { addToCart: "+ 加入购物车", shopNow: "立即购买 →", badgeNew: "新品" },
    productDetail: { perPiece: "/ 件", shopNow: "立即购买 →", addWishlist: "♡ 加入收藏夹", inWishlist: "♥ 已在收藏夹中", addCompare: "⇄ 加入对比", inCompare: "⇄ 已在对比中" },
    cart: { title: "购物车", emptyTitle: "您的购物车是空的", emptyText: "将产品添加到购物车后会显示在这里。", continueShopping: "继续购物", total: "总计", proceedCheckout: "前往结账", remove: "移除" },
    wishlist: { title: "我的收藏夹", emptyTitle: "您的收藏夹是空的", emptyText: "点击任意产品上的心形图标即可保存到这里。", moveToCart: "移入购物车", remove: "移除" },
    compare: { title: "产品对比", emptyTitle: "暂无对比产品", emptyText: "点击最多3件产品上的⇄图标即可在此对比。", product: "产品", name: "名称", price: "价格", category: "分类", details: "详情", addToCart: "加入购物车", remove: "移除" },
    checkout: { backToCart: "← 返回购物车", heading: "完成您的订单", subtitle: "请填写您的信息以继续购买。", fullName: "姓名", email: "电子邮箱", phone: "电话号码", address: "收货地址", city: "城市", placeName: "请输入您的姓名", placeEmail: "请输入您的电子邮箱", placePhone: "请输入您的电话号码", placeAddress: "请输入完整的收货地址", placeCity: "您的城市", placeOrder: "下订单", yourOrder: "您的订单", quantity: "数量", total: "总计" },
    orderSuccess: { thankYou: "谢谢", message: "您的订单已成功提交。", orderId: "订单编号：", total: "总计：", continueShopping: "继续购物" },
    newArrivals: { kicker: "最新到货", heading: "新品上市", subtitle: "来自各系列的最新产品。" },
    bestSellers: { kicker: "精选推荐", heading: "畅销产品", subtitle: "顾客最喜爱的热门产品。" },
    blogs: { kicker: "MEER 期刊", heading: "博客", subtitle: "穿搭建议、购物指南与时尚灵感。" },
    common: { products: "产品" },
    sectionHeadings: {
      fashion: { kicker: "MEER系列", heading: "时尚产品", subtitle: "探索我们的最新时尚系列。" },
      jewellery: { kicker: "MEER系列", heading: "珠宝产品", subtitle: "探索我们优雅的珠宝与奢华腕表系列。" },
      bags: { kicker: "包袋配饰", subtitle: "探索我们精选的{category}系列。" },
      uk: { kicker: "英国独家", heading: "英国系列产品", subtitle: "探索英伦传承、现代时尚与优质配饰。" },
      india: { kicker: "印度传承", heading: "印度系列产品", subtitle: "探索手工传统时尚与印度灵感的民族奢华。" },
           india: { kicker: "印度传承", heading: "印度系列产品", subtitle: "探索手工传统时尚与印度灵感的民族奢华。" },

      pt: {
    nav: { categories: "Categorias", home: "Início", newArrivals: "Novidades", indiaCollection: "Coleção Índia", ukCollection: "Coleção Reino Unido", allCategories: "Todas as Categorias", bestSellers: "Mais Vendidos", blogs: "Blog" },
    categoryMenu: { fashion: "Moda", jewellery: "Joias", bags: "Bolsas e Acessórios", uk: "Coleção Reino Unido", india: "Coleção Índia" },
    topBar: { followUs: "Siga-nos", login: "Entrar", registration: "Cadastro" },
    announcement: { line1: "FRETE GRÁTIS PARA TODO O MUNDO EM PEDIDOS ACIMA DE $100", line2: "COLEÇÕES EXCLUSIVAS DA ÍNDIA E REINO UNIDO", line3: "COMPRE PREMIUM • COMPRE MEER" },
    search: { placeholder: "Buscar produtos...", searchLabel: "Buscar", resultsKicker: "BUSCA", resultsHeading: "Resultados da Busca", found: "{count} produto(s) encontrados para \"{term}\"", notFound: "Nenhum produto encontrado para \"{term}\". Tente outra palavra.", clear: "← Limpar Busca" },
    header: { compare: "Comparar", wishlist: "Favoritos", cart: "Carrinho" },
    hero: { shopNow: "COMPRAR AGORA" },
    deal: { title: "Oferta do Dia", subtitle: "Ofertas por tempo limitado", specialOffer: "OFERTA ESPECIAL", newArrival: "NOVIDADE", viewDeal: "Ver Oferta →" },
    collectionStrip: { indiaTitle: "Coleção Índia", indiaDesc: "Herança e artesanato", ukTitle: "Coleção Reino Unido", ukDesc: "Elegância moderna", qualityTitle: "Qualidade Premium", qualityDesc: "Selecionado com cuidado", secureTitle: "Compra Segura", secureDesc: "Seguro e confiável" },
    categoriesSection: { kicker: "EXPLORE A MEER", heading: "Compre por Categoria", subtitle: "Descubra nossas coleções cuidadosamente selecionadas.", explore: "Explorar →" },
    luxury: { indiaKicker: "HERANÇA MEER", indiaHeading: "Coleção Índia", indiaDesc: "Herança atemporal, artesanato refinado e luxo inspirado na Índia.", ukKicker: "ASSINATURA MEER", ukHeading: "Coleção Reino Unido", ukDesc: "Elegância moderna, estilo sofisticado e luxo britânico contemporâneo.", explore: "Explorar Coleção →" },
    back: { allCategories: "← Voltar para Todas as Categorias", bagsCategories: "← Voltar para Categorias de Bolsas", categories: "← Voltar para Categorias" },
    bagsSection: { kicker: "BOLSAS E ACESSÓRIOS", heading: "Explore as Categorias", subtitle: "Escolha uma coleção para explorar nossos produtos selecionados." },
    productCard: { addToCart: "+ Adicionar ao Carrinho", shopNow: "COMPRAR AGORA →", badgeNew: "NOVO" },
    productDetail: { perPiece: "/ unidade", shopNow: "COMPRAR AGORA →", addWishlist: "♡ Adicionar aos Favoritos", inWishlist: "♥ Nos Favoritos", addCompare: "⇄ Adicionar à Comparação", inCompare: "⇄ Na Comparação" },
    cart: { title: "Carrinho de Compras", emptyTitle: "Seu carrinho está vazio", emptyText: "Adicione produtos ao seu carrinho e eles aparecerão aqui.", continueShopping: "Continuar Comprando", total: "Total", proceedCheckout: "Finalizar Compra", remove: "Remover" },
    wishlist: { title: "Minha Lista de Desejos", emptyTitle: "Sua lista de desejos está vazia", emptyText: "Toque no coração de qualquer produto para salvá-lo aqui.", moveToCart: "Mover para o Carrinho", remove: "Remover" },
    compare: { title: "Comparar Produtos", emptyTitle: "Nenhum produto para comparar", emptyText: "Toque no ícone ⇄ em até 3 produtos para compará-los aqui.", product: "Produto", name: "Nome", price: "Preço", category: "Categoria", details: "Detalhes", addToCart: "Adicionar ao Carrinho", remove: "Remover" },
    checkout: { backToCart: "← Voltar ao Carrinho", heading: "Complete Seu Pedido", subtitle: "Insira seus dados para continuar com a compra.", fullName: "Nome Completo", email: "Endereço de E-mail", phone: "Número de Telefone", address: "Endereço de Entrega", city: "Cidade", placeName: "Digite seu nome completo", placeEmail: "Digite seu e-mail", placePhone: "Digite seu número de telefone", placeAddress: "Digite seu endereço de entrega completo", placeCity: "Sua cidade", placeOrder: "Fazer Pedido", yourOrder: "Seu Pedido", quantity: "Quantidade", total: "Total" },
    orderSuccess: { thankYou: "Obrigado", message: "Seu pedido foi feito com sucesso.", orderId: "ID do Pedido:", total: "Total:", continueShopping: "Continuar Comprando" },
    newArrivals: { kicker: "RECÉM-CHEGADOS", heading: "Novidades", subtitle: "Nossos produtos mais recentes de cada coleção." },
    bestSellers: { kicker: "MAIS ESCOLHIDOS", heading: "Mais Vendidos", subtitle: "Os produtos mais amados escolhidos por nossos clientes." },
    blogs: { kicker: "JORNAL MEER", heading: "Blog", subtitle: "Dicas de estilo, guias de compra e inspiração de moda." },
    common: { products: "Produtos" },
    sectionHeadings: {
      fashion: { kicker: "COLEÇÃO MEER", heading: "Produtos de Moda", subtitle: "Descubra nossa mais recente coleção de moda." },
      jewellery: { kicker: "COLEÇÃO MEER", heading: "Produtos de Joalheria", subtitle: "Descubra nossa elegante coleção de joias e relógios de luxo." },
      bags: { kicker: "BOLSAS E ACESSÓRIOS", subtitle: "Descubra nossa coleção selecionada de {category}." },
      uk: { kicker: "EXCLUSIVO REINO UNIDO", heading: "Produtos da Coleção Reino Unido", subtitle: "Descubra a herança britânica, moda moderna e acessórios premium." },
      india: { kicker: "HERANÇA DA ÍNDIA", heading: "Produtos da Coleção Índia", subtitle: "Descubra moda tradicional artesanal e luxo étnico inspirado na Índia." },
    },
  },
  ru: {
    nav: { categories: "Категории", home: "Главная", newArrivals: "Новинки", indiaCollection: "Коллекция Индии", ukCollection: "Коллекция Великобритании", allCategories: "Все категории", bestSellers: "Хиты продаж", blogs: "Блог" },
    categoryMenu: { fashion: "Мода", jewellery: "Ювелирные изделия", bags: "Сумки и аксессуары", uk: "Коллекция Великобритании", india: "Коллекция Индии" },
    topBar: { followUs: "Подписывайтесь на нас", login: "Вход", registration: "Регистрация" },
    announcement: { line1: "БЕСПЛАТНАЯ ДОСТАВКА ПО ВСЕМУ МИРУ ПРИ ЗАКАЗЕ ОТ $100", line2: "ЭКСКЛЮЗИВНЫЕ КОЛЛЕКЦИИ ИНДИИ И ВЕЛИКОБРИТАНИИ", line3: "ПОКУПАЙТЕ ПРЕМИУМ • ПОКУПАЙТЕ MEER" },
    search: { placeholder: "Поиск товаров...", searchLabel: "Поиск", resultsKicker: "ПОИСК", resultsHeading: "Результаты поиска", found: "Найдено {count} товар(ов) по запросу \"{term}\"", notFound: "Товары по запросу \"{term}\" не найдены. Попробуйте другое слово.", clear: "← Очистить поиск" },
    header: { compare: "Сравнить", wishlist: "Избранное", cart: "Корзина" },
    hero: { shopNow: "КУПИТЬ СЕЙЧАС" },
    deal: { title: "Предложение дня", subtitle: "Ограниченные по времени предложения", specialOffer: "СПЕЦПРЕДЛОЖЕНИЕ", newArrival: "НОВИНКА", viewDeal: "Смотреть предложение →" },
    collectionStrip: { indiaTitle: "Коллекция Индии", indiaDesc: "Наследие и мастерство", ukTitle: "Коллекция Великобритании", ukDesc: "Современная элегантность", qualityTitle: "Премиум качество", qualityDesc: "Тщательно отобрано", secureTitle: "Безопасные покупки", secureDesc: "Надёжно и безопасно" },
    categoriesSection: { kicker: "ИССЛЕДУЙТЕ MEER", heading: "Покупки по категориям", subtitle: "Откройте для себя наши тщательно отобранные коллекции.", explore: "Смотреть →" },
    luxury: { indiaKicker: "НАСЛЕДИЕ MEER", indiaHeading: "Коллекция Индии", indiaDesc: "Вечное наследие, изысканное мастерство и роскошь, вдохновлённая Индией.", ukKicker: "ПОДПИСЬ MEER", ukHeading: "Коллекция Великобритании", ukDesc: "Современная элегантность, изысканный стиль и современная британская роскошь.", explore: "Смотреть коллекцию →" },
    back: { allCategories: "← Назад ко всем категориям", bagsCategories: "← Назад к категориям сумок", categories: "← Назад к категориям" },
    bagsSection: { kicker: "СУМКИ И АКСЕССУАРЫ", heading: "Изучите категории", subtitle: "Выберите коллекцию, чтобы изучить наши отобранные товары." },
    productCard: { addToCart: "+ В корзину", shopNow: "КУПИТЬ СЕЙЧАС →", badgeNew: "НОВИНКА" },
    productDetail: { perPiece: "/ шт.", shopNow: "КУПИТЬ СЕЙЧАС →", addWishlist: "♡ В избранное", inWishlist: "♥ В избранном", addCompare: "⇄ Добавить к сравнению", inCompare: "⇄ В сравнении" },
    cart: { title: "Корзина", emptyTitle: "Ваша корзина пуста", emptyText: "Добавьте товары в корзину, и они появятся здесь.", continueShopping: "Продолжить покупки", total: "Итого", proceedCheckout: "Оформить заказ", remove: "Удалить" },
    wishlist: { title: "Мой список желаний", emptyTitle: "Ваш список желаний пуст", emptyText: "Нажмите на сердечко на любом товаре, чтобы сохранить его здесь.", moveToCart: "Переместить в корзину", remove: "Удалить" },
    compare: { title: "Сравнить товары", emptyTitle: "Нет товаров для сравнения", emptyText: "Нажмите на значок ⇄ на до 3 товаров, чтобы сравнить их здесь.", product: "Товар", name: "Название", price: "Цена", category: "Категория", details: "Детали", addToCart: "В корзину", remove: "Удалить" },
    checkout: { backToCart: "← Назад в корзину", heading: "Завершите заказ", subtitle: "Введите свои данные, чтобы продолжить покупку.", fullName: "Полное имя", email: "Электронная почта", phone: "Номер телефона", address: "Адрес доставки", city: "Город", placeName: "Введите ваше полное имя", placeEmail: "Введите вашу почту", placePhone: "Введите номер телефона", placeAddress: "Введите полный адрес доставки", placeCity: "Ваш город", placeOrder: "Оформить заказ", yourOrder: "Ваш заказ", quantity: "Количество", total: "Итого" },
    orderSuccess: { thankYou: "Спасибо", message: "Ваш заказ успешно оформлен.", orderId: "Номер заказа:", total: "Итого:", continueShopping: "Продолжить покупки" },
    newArrivals: { kicker: "НОВОЕ ПОСТУПЛЕНИЕ", heading: "Новинки", subtitle: "Наши новейшие товары из каждой коллекции." },
    bestSellers: { kicker: "ЛУЧШИЙ ВЫБОР", heading: "Хиты продаж", subtitle: "Самые любимые товары наших покупателей." },
    blogs: { kicker: "ЖУРНАЛ MEER", heading: "Блог", subtitle: "Советы по стилю, руководства по покупкам и модное вдохновение." },
    common: { products: "Товары" },
    sectionHeadings: {
      fashion: { kicker: "КОЛЛЕКЦИЯ MEER", heading: "Модная одежда", subtitle: "Откройте для себя нашу новейшую модную коллекцию." },
      jewellery: { kicker: "КОЛЛЕКЦИЯ MEER", heading: "Ювелирные изделия", subtitle: "Откройте для себя нашу элегантную коллекцию украшений и роскошных часов." },
      bags: { kicker: "СУМКИ И АКСЕССУАРЫ", subtitle: "Откройте для себя нашу подобранную коллекцию {category}." },
      uk: { kicker: "ЭКСКЛЮЗИВ ВЕЛИКОБРИТАНИИ", heading: "Товары коллекции Великобритании", subtitle: "Откройте для себя британское наследие, современную моду и премиум-аксессуары." },
      india: { kicker: "НАСЛЕДИЕ ИНДИИ", heading: "Товары коллекции Индии", subtitle: "Откройте для себя традиционную ручную моду и этническую роскошь, вдохновлённую Индией." },
    },
  },
  tr: {
    nav: { categories: "Kategoriler", home: "Ana Sayfa", newArrivals: "Yeni Gelenler", indiaCollection: "Hindistan Koleksiyonu", ukCollection: "İngiltere Koleksiyonu", allCategories: "Tüm Kategoriler", bestSellers: "Çok Satanlar", blogs: "Blog" },
    categoryMenu: { fashion: "Moda", jewellery: "Mücevher", bags: "Çanta ve Aksesuar", uk: "İngiltere Koleksiyonu", india: "Hindistan Koleksiyonu" },
    topBar: { followUs: "Bizi takip edin", login: "Giriş Yap", registration: "Kayıt Ol" },
    announcement: { line1: "100 $ ÜZERİ SİPARİŞLERDE ÜCRETSİZ DÜNYA GENELİ KARGO", line2: "HİNDİSTAN VE İNGİLTERE'YE ÖZEL KOLEKSİYONLAR", line3: "PREMIUM ALIŞVERİŞ • MEER'DEN ALIŞVERİŞ" },
    search: { placeholder: "Ürün ara...", searchLabel: "Ara", resultsKicker: "ARAMA", resultsHeading: "Arama Sonuçları", found: "\"{term}\" için {count} ürün bulundu", notFound: "\"{term}\" için ürün bulunamadı. Başka bir kelime deneyin.", clear: "← Aramayı Temizle" },
    header: { compare: "Karşılaştır", wishlist: "İstek Listesi", cart: "Sepet" },
    hero: { shopNow: "HEMEN AL" },
    deal: { title: "Günün Fırsatı", subtitle: "Süreli teklifler", specialOffer: "ÖZEL TEKLİF", newArrival: "YENİ ÜRÜN", viewDeal: "Fırsatı Gör →" },
    collectionStrip: { indiaTitle: "Hindistan Koleksiyonu", indiaDesc: "Miras ve zanaatkârlık", ukTitle: "İngiltere Koleksiyonu", ukDesc: "Modern zarafet", qualityTitle: "Premium Kalite", qualityDesc: "Özenle seçildi", secureTitle: "Güvenli Alışveriş", secureDesc: "Güvenli ve güvenilir" },
    categoriesSection: { kicker: "MEER'İ KEŞFEDİN", heading: "Kategoriye Göre Alışveriş", subtitle: "Özenle seçilmiş koleksiyonlarımızı keşfedin.", explore: "Keşfet →" },
    luxury: { indiaKicker: "MEER MİRASI", indiaHeading: "Hindistan Koleksiyonu", indiaDesc: "Zamansız miras, rafine zanaatkârlık ve Hindistan'dan ilham alan lüks.", ukKicker: "MEER İMZASI", ukHeading: "İngiltere Koleksiyonu", ukDesc: "Modern zarafet, sofistike stil ve çağdaş İngiliz lüksü.", explore: "Koleksiyonu Keşfet →" },
    back: { allCategories: "← Tüm Kategorilere Dön", bagsCategories: "← Çanta Kategorilerine Dön", categories: "← Kategorilere Dön" },
    bagsSection: { kicker: "ÇANTA VE AKSESUAR", heading: "Kategorileri Keşfedin", subtitle: "Seçilmiş ürünlerimizi keşfetmek için bir koleksiyon seçin." },
    productCard: { addToCart: "+ Sepete Ekle", shopNow: "HEMEN AL →", badgeNew: "YENİ" },
    productDetail: { perPiece: "/ adet", shopNow: "HEMEN AL →", addWishlist: "♡ İstek Listesine Ekle", inWishlist: "♥ İstek Listesinde", addCompare: "⇄ Karşılaştırmaya Ekle", inCompare: "⇄ Karşılaştırmada" },
    cart: { title: "Alışveriş Sepeti", emptyTitle: "Sepetiniz boş", emptyText: "Sepetinize ürün ekleyin, burada görünecekler.", continueShopping: "Alışverişe Devam Et", total: "Toplam", proceedCheckout: "Ödemeye Geç", remove: "Kaldır" },
    wishlist: { title: "İstek Listem", emptyTitle: "İstek listeniz boş", emptyText: "Herhangi bir ürünü buraya kaydetmek için kalbe dokunun.", moveToCart: "Sepete Taşı", remove: "Kaldır" },
    compare: { title: "Ürünleri Karşılaştır", emptyTitle: "Karşılaştırılacak ürün yok", emptyText: "Burada karşılaştırmak için 3 ürüne kadar ⇄ simgesine dokunun.", product: "Ürün", name: "İsim", price: "Fiyat", category: "Kategori", details: "Detaylar", addToCart: "Sepete Ekle", remove: "Kaldır" },
    checkout: { backToCart: "← Sepete Dön", heading: "Siparişinizi Tamamlayın", subtitle: "Alışverişe devam etmek için bilgilerinizi girin.", fullName: "Ad Soyad", email: "E-posta Adresi", phone: "Telefon Numarası", address: "Teslimat Adresi", city: "Şehir", placeName: "Ad soyadınızı girin", placeEmail: "E-postanızı girin", placePhone: "Telefon numaranızı girin", placeAddress: "Tam teslimat adresinizi girin", placeCity: "Şehriniz", placeOrder: "Sipariş Ver", yourOrder: "Siparişiniz", quantity: "Adet", total: "Toplam" },
    orderSuccess: { thankYou: "Teşekkürler", message: "Siparişiniz başarıyla alındı.", orderId: "Sipariş No:", total: "Toplam:", continueShopping: "Alışverişe Devam Et" },
    newArrivals: { kicker: "YENİ GELDİ", heading: "Yeni Gelenler", subtitle: "Her koleksiyondan en yeni ürünlerimiz." },
    bestSellers: { kicker: "EN İYİ SEÇİMLER", heading: "Çok Satanlar", subtitle: "Müşterilerimizin en çok sevdiği ürünler." },
    blogs: { kicker: "MEER DERGİSİ", heading: "Blog", subtitle: "Stil ipuçları, alışveriş rehberleri ve moda ilhamı." },
    common: { products: "Ürünler" },
    sectionHeadings: {
      fashion: { kicker: "MEER KOLEKSİYONU", heading: "Moda Ürünleri", subtitle: "En yeni moda koleksiyonumuzu keşfedin." },
      jewellery: { kicker: "MEER KOLEKSİYONU", heading: "Mücevher Ürünleri", subtitle: "Zarif mücevher ve lüks saat koleksiyonumuzu keşfedin." },
      bags: { kicker: "ÇANTA VE AKSESUAR", subtitle: "Seçilmiş {category} koleksiyonumuzu keşfedin." },
      uk: { kicker: "İNGİLTERE'YE ÖZEL", heading: "İngiltere Koleksiyonu Ürünleri", subtitle: "İngiliz mirasını, modern modayı ve premium aksesuarları keşfedin." },
      india: { kicker: "HİNDİSTAN MİRASI", heading: "Hindistan Koleksiyonu Ürünleri", subtitle: "El yapımı geleneksel modayı ve Hindistan'dan ilham alan etnik lüksü keşfedin." },
    },
  },
  it: {
    nav: { categories: "Categorie", home: "Home", newArrivals: "Novità", indiaCollection: "Collezione India", ukCollection: "Collezione UK", allCategories: "Tutte le Categorie", bestSellers: "Più Venduti", blogs: "Blog" },
    categoryMenu: { fashion: "Moda", jewellery: "Gioielli", bags: "Borse e Accessori", uk: "Collezione UK", india: "Collezione India" },
    topBar: { followUs: "Seguici", login: "Accedi", registration: "Registrati" },
    announcement: { line1: "SPEDIZIONE MONDIALE GRATUITA PER ORDINI SUPERIORI A $100", line2: "COLLEZIONI ESCLUSIVE INDIA E UK", line3: "ACQUISTA PREMIUM • ACQUISTA MEER" },
    search: { placeholder: "Cerca prodotti...", searchLabel: "Cerca", resultsKicker: "RICERCA", resultsHeading: "Risultati della Ricerca", found: "{count} prodotto/i trovato/i per \"{term}\"", notFound: "Nessun prodotto trovato per \"{term}\". Prova un'altra parola.", clear: "← Cancella Ricerca" },
    header: { compare: "Confronta", wishlist: "Preferiti", cart: "Carrello" },
    hero: { shopNow: "ACQUISTA ORA" },
    deal: { title: "Offerta del Giorno", subtitle: "Offerte a tempo limitato", specialOffer: "OFFERTA SPECIALE", newArrival: "NOVITÀ", viewDeal: "Vedi Offerta →" },
    collectionStrip: { indiaTitle: "Collezione India", indiaDesc: "Eredità e artigianato", ukTitle: "Collezione UK", ukDesc: "Eleganza moderna", qualityTitle: "Qualità Premium", qualityDesc: "Selezionato con cura", secureTitle: "Acquisti Sicuri", secureDesc: "Sicuro e affidabile" },
    categoriesSection: { kicker: "ESPLORA MEER", heading: "Acquista per Categoria", subtitle: "Scopri le nostre collezioni accuratamente selezionate.", explore: "Esplora →" },
    luxury: { indiaKicker: "EREDITÀ MEER", indiaHeading: "Collezione India", indiaDesc: "Eredità senza tempo, artigianato raffinato e lusso ispirato all'India.", ukKicker: "FIRMA MEER", ukHeading: "Collezione UK", ukDesc: "Eleganza moderna, stile sofisticato e lusso britannico contemporaneo.", explore: "Esplora Collezione →" },
    back: { allCategories: "← Torna a Tutte le Categorie", bagsCategories: "← Torna alle Categorie Borse", categories: "← Torna alle Categorie" },
    bagsSection: { kicker: "BORSE E ACCESSORI", heading: "Esplora le Categorie", subtitle: "Scegli una collezione per esplorare i nostri prodotti selezionati." },
    productCard: { addToCart: "+ Aggiungi al Carrello", shopNow: "ACQUISTA ORA →", badgeNew: "NUOVO" },
    productDetail: { perPiece: "/ pz", shopNow: "ACQUISTA ORA →", addWishlist: "♡ Aggiungi ai Preferiti", inWishlist: "♥ Nei Preferiti", addCompare: "⇄ Aggiungi al Confronto", inCompare: "⇄ Nel Confronto" },
    cart: { title: "Carrello", emptyTitle: "Il tuo carrello è vuoto", emptyText: "Aggiungi prodotti al carrello e appariranno qui.", continueShopping: "Continua lo Shopping", total: "Totale", proceedCheckout: "Procedi al Pagamento", remove: "Rimuovi" },
    wishlist: { title: "La Mia Lista Desideri", emptyTitle: "La tua lista desideri è vuota", emptyText: "Tocca il cuore su qualsiasi prodotto per salvarlo qui.", moveToCart: "Sposta nel Carrello", remove: "Rimuovi" },
    compare: { title: "Confronta Prodotti", emptyTitle: "Nessun prodotto da confrontare", emptyText: "Tocca l'icona ⇄ su fino a 3 prodotti per confrontarli qui.", product: "Prodotto", name: "Nome", price: "Prezzo", category: "Categoria", details: "Dettagli", addToCart: "Aggiungi al Carrello", remove: "Rimuovi" },
    checkout: { backToCart: "← Torna al Carrello", heading: "Completa il Tuo Ordine", subtitle: "Inserisci i tuoi dati per continuare con l'acquisto.", fullName: "Nome Completo", email: "Indirizzo Email", phone: "Numero di Telefono", address: "Indirizzo di Consegna", city: "Città", placeName: "Inserisci il tuo nome completo", placeEmail: "Inserisci la tua email", placePhone: "Inserisci il tuo numero di telefono", placeAddress: "Inserisci l'indirizzo di consegna completo", placeCity: "La tua città", placeOrder: "Effettua l'Ordine", yourOrder: "Il Tuo Ordine", quantity: "Quantità", total: "Totale" },
    orderSuccess: { thankYou: "Grazie", message: "Il tuo ordine è stato effettuato con successo.", orderId: "ID Ordine:", total: "Totale:", continueShopping: "Continua lo Shopping" },
    newArrivals: { kicker: "APPENA ARRIVATO", heading: "Novità", subtitle: "I nostri prodotti più recenti da ogni collezione." },
    bestSellers: { kicker: "SCELTE MIGLIORI", heading: "Più Venduti", subtitle: "I prodotti più amati scelti dai nostri clienti." },
    blogs: { kicker: "JOURNAL MEER", heading: "Blog", subtitle: "Consigli di stile, guide all'acquisto e ispirazione moda." },
    common: { products: "Prodotti" },
    sectionHeadings: {
      fashion: { kicker: "COLLEZIONE MEER", heading: "Prodotti Moda", subtitle: "Scopri la nostra ultima collezione moda." },
      jewellery: { kicker: "COLLEZIONE MEER", heading: "Prodotti Gioielleria", subtitle: "Scopri la nostra elegante collezione di gioielli e orologi di lusso." },
      bags: { kicker: "BORSE E ACCESSORI", subtitle: "Scopri la nostra collezione selezionata di {category}." },
      uk: { kicker: "ESCLUSIVO UK", heading: "Prodotti della Collezione UK", subtitle: "Scopri l'eredità britannica, la moda moderna e gli accessori premium." },
      india: { kicker: "EREDITÀ INDIA", heading: "Prodotti della Collezione India", subtitle: "Scopri la moda tradizionale artigianale e il lusso etnico ispirato all'India." },
    },
  },
  ja: {
    nav: { categories: "カテゴリー", home: "ホーム", newArrivals: "新着商品", indiaCollection: "インドコレクション", ukCollection: "英国コレクション", allCategories: "すべてのカテゴリー", bestSellers: "ベストセラー", blogs: "ブログ" },
    categoryMenu: { fashion: "ファッション", jewellery: "ジュエリー", bags: "バッグ・アクセサリー", uk: "英国コレクション", india: "インドコレクション" },
    topBar: { followUs: "フォローする", login: "ログイン", registration: "新規登録" },
    announcement: { line1: "100ドル以上のご注文で全世界送料無料", line2: "インドと英国の限定コレクション", line3: "プレミアムを買う • MEERで買う" },
    search: { placeholder: "商品を検索...", searchLabel: "検索", resultsKicker: "検索", resultsHeading: "検索結果", found: "\"{term}\" の検索結果 {count}件", notFound: "\"{term}\" に一致する商品が見つかりません。別のキーワードをお試しください。", clear: "← 検索をクリア" },
    header: { compare: "比較", wishlist: "ウィッシュリスト", cart: "カート" },
    hero: { shopNow: "今すぐ購入" },
    deal: { title: "本日のセール", subtitle: "期間限定オファー", specialOffer: "特別オファー", newArrival: "新着", viewDeal: "セールを見る →" },
    collectionStrip: { indiaTitle: "インドコレクション", indiaDesc: "伝統と職人技", ukTitle: "英国コレクション", ukDesc: "モダンなエレガンス", qualityTitle: "プレミアム品質", qualityDesc: "厳選されたアイテム", secureTitle: "安全なお買い物", secureDesc: "安全で信頼できる" },
    categoriesSection: { kicker: "MEERを探る", heading: "カテゴリー別に買う", subtitle: "厳選されたコレクションをご覧ください。", explore: "見る →" },
    luxury: { indiaKicker: "MEERの伝統", indiaHeading: "インドコレクション", indiaDesc: "時代を超えた伝統、洗練された職人技、インドに着想を得たラグジュアリー。", ukKicker: "MEERシグネチャー", ukHeading: "英国コレクション", ukDesc: "モダンなエレガンス、洗練されたスタイル、現代の英国ラグジュアリー。", explore: "コレクションを見る →" },
    back: { allCategories: "← すべてのカテゴリーに戻る", bagsCategories: "← バッグのカテゴリーに戻る", categories: "← カテゴリーに戻る" },
    bagsSection: { kicker: "バッグ・アクセサリー", heading: "カテゴリーを見る", subtitle: "コレクションを選んで、厳選された商品をご覧ください。" },
    productCard: { addToCart: "+ カートに追加", shopNow: "今すぐ購入 →", badgeNew: "新着" },
    productDetail: { perPiece: "/ 個", shopNow: "今すぐ購入 →", addWishlist: "♡ ウィッシュリストに追加", inWishlist: "♥ ウィッシュリストに追加済み", addCompare: "⇄ 比較に追加", inCompare: "⇄ 比較に追加済み" },
    cart: { title: "ショッピングカート", emptyTitle: "カートは空です", emptyText: "商品をカートに追加すると、ここに表示されます。", continueShopping: "買い物を続ける", total: "合計", proceedCheckout: "チェックアウトに進む", remove: "削除" },
    wishlist: { title: "マイウィッシュリスト", emptyTitle: "ウィッシュリストは空です", emptyText: "商品のハートマークをタップして保存してください。", moveToCart: "カートに移動", remove: "削除" },
    compare: { title: "商品を比較", emptyTitle: "比較する商品がありません", emptyText: "最大3つの商品の⇄アイコンをタップして比較できます。", product: "商品", name: "商品名", price: "価格", category: "カテゴリー", details: "詳細", addToCart: "カートに追加", remove: "削除" },
    checkout: { backToCart: "← カートに戻る", heading: "ご注文を完了する", subtitle: "購入を続けるには情報を入力してください。", fullName: "氏名", email: "メールアドレス", phone: "電話番号", address: "配送先住所", city: "市区町村", placeName: "氏名を入力してください", placeEmail: "メールアドレスを入力してください", placePhone: "電話番号を入力してください", placeAddress: "配送先の完全な住所を入力してください", placeCity: "お住まいの市区町村", placeOrder: "注文する", yourOrder: "ご注文内容", quantity: "数量", total: "合計" },
    orderSuccess: { thankYou: "ありがとうございます", message: "ご注文が正常に完了しました。", orderId: "注文番号：", total: "合計：", continueShopping: "買い物を続ける" },
    newArrivals: { kicker: "新着入荷", heading: "新着商品", subtitle: "各コレクションの最新アイテム。" },
    bestSellers: { kicker: "人気の逸品", heading: "ベストセラー", subtitle: "お客様に最も愛されている商品。" },
    blogs: { kicker: "MEERジャーナル", heading: "ブログ", subtitle: "スタイルのヒント、購入ガイド、ファッションのインスピレーション。" },
    common: { products: "商品" },
    sectionHeadings: {
      fashion: { kicker: "MEERコレクション", heading: "ファッション商品", subtitle: "最新のファッションコレクションをご覧ください。" },
      jewellery: { kicker: "MEERコレクション", heading: "ジュエリー商品", subtitle: "エレガントなジュエリーと高級時計のコレクションをご覧ください。" },
      bags: { kicker: "バッグ・アクセサリー", subtitle: "厳選された{category}コレクションをご覧ください。" },
      uk: { kicker: "英国限定", heading: "英国コレクション商品", subtitle: "英国の伝統、モダンファッション、プレミアムアクセサリーをご覧ください。" },
      india: { kicker: "インドの伝統", heading: "インドコレクション商品", subtitle: "手作りの伝統的なファッションとインドに着想を得た民族的なラグジュアリーをご覧ください。" },
    },
  },
  ko: {
    nav: { categories: "카테고리", home: "홈", newArrivals: "신상품", indiaCollection: "인도 컬렉션", ukCollection: "영국 컬렉션", allCategories: "모든 카테고리", bestSellers: "베스트셀러", blogs: "블로그" },
    categoryMenu: { fashion: "패션", jewellery: "주얼리", bags: "가방 및 액세서리", uk: "영국 컬렉션", india: "인도 컬렉션" },
    topBar: { followUs: "팔로우하기", login: "로그인", registration: "회원가입" },
    announcement: { line1: "100달러 이상 주문 시 전세계 무료 배송", line2: "인도 & 영국 독점 컬렉션", line3: "프리미엄 쇼핑 • MEER에서 쇼핑" },
    search: { placeholder: "상품 검색...", searchLabel: "검색", resultsKicker: "검색", resultsHeading: "검색 결과", found: "\"{term}\"에 대해 {count}개의 상품을 찾았습니다", notFound: "\"{term}\"에 대한 상품을 찾을 수 없습니다. 다른 단어를 시도해보세요.", clear: "← 검색 지우기" },
    header: { compare: "비교", wishlist: "위시리스트", cart: "장바구니" },
    hero: { shopNow: "지금 구매" },
    deal: { title: "오늘의 특가", subtitle: "한정 기간 특가", specialOffer: "특별 할인", newArrival: "신상품", viewDeal: "특가 보기 →" },
    collectionStrip: { indiaTitle: "인도 컬렉션", indiaDesc: "전통과 장인정신", ukTitle: "영국 컬렉션", ukDesc: "현대적인 우아함", qualityTitle: "프리미엄 품질", qualityDesc: "정성껏 엄선됨", secureTitle: "안전한 쇼핑", secureDesc: "안전하고 신뢰할 수 있음" },
    categoriesSection: { kicker: "MEER 둘러보기", heading: "카테고리별 쇼핑", subtitle: "정성껏 엄선된 컬렉션을 만나보세요.", explore: "둘러보기 →" },
    luxury: { indiaKicker: "MEER 헤리티지", indiaHeading: "인도 컬렉션", indiaDesc: "시대를 초월한 유산, 세련된 장인정신, 인도에서 영감을 받은 럭셔리.", ukKicker: "MEER 시그니처", ukHeading: "영국 컬렉션", ukDesc: "현대적인 우아함, 세련된 스타일, 현대 영국 럭셔리.", explore: "컬렉션 보기 →" },
    back: { allCategories: "← 모든 카테고리로 돌아가기", bagsCategories: "← 가방 카테고리로 돌아가기", categories: "← 카테고리로 돌아가기" },
    bagsSection: { kicker: "가방 및 액세서리", heading: "카테고리 둘러보기", subtitle: "엄선된 상품을 보려면 컬렉션을 선택하세요." },
    productCard: { addToCart: "+ 장바구니에 추가", shopNow: "지금 구매 →", badgeNew: "신상" },
    productDetail: { perPiece: "/ 개", shopNow: "지금 구매 →", addWishlist: "♡ 위시리스트에 추가", inWishlist: "♥ 위시리스트에 있음", addCompare: "⇄ 비교에 추가", inCompare: "⇄ 비교 중" },
    cart: { title: "장바구니", emptyTitle: "장바구니가 비어 있습니다", emptyText: "장바구니에 상품을 추가하면 여기에 표시됩니다.", continueShopping: "쇼핑 계속하기", total: "합계", proceedCheckout: "결제 진행", remove: "삭제" },
    wishlist: { title: "내 위시리스트", emptyTitle: "위시리스트가 비어 있습니다", emptyText: "상품의 하트를 눌러 여기에 저장하세요.", moveToCart: "장바구니로 이동", remove: "삭제" },
    compare: { title: "상품 비교", emptyTitle: "비교할 상품이 없습니다", emptyText: "최대 3개 상품의 ⇄ 아이콘을 눌러 비교하세요.", product: "상품", name: "이름", price: "가격", category: "카테고리", details: "상세정보", addToCart: "장바구니에 추가", remove: "삭제" },
    checkout: { backToCart: "← 장바구니로 돌아가기", heading: "주문 완료하기", subtitle: "구매를 계속하려면 정보를 입력하세요.", fullName: "성명", email: "이메일 주소", phone: "전화번호", address: "배송 주소", city: "도시", placeName: "성명을 입력하세요", placeEmail: "이메일을 입력하세요", placePhone: "전화번호를 입력하세요", placeAddress: "전체 배송 주소를 입력하세요", placeCity: "거주 도시", placeOrder: "주문하기", yourOrder: "주문 내역", quantity: "수량", total: "합계" },
    orderSuccess: { thankYou: "감사합니다", message: "주문이 성공적으로 완료되었습니다.", orderId: "주문 번호:", total: "합계:", continueShopping: "쇼핑 계속하기" },
    newArrivals: { kicker: "새로 입고됨", heading: "신상품", subtitle: "각 컬렉션의 최신 상품." },
    bestSellers: { kicker: "최고 인기", heading: "베스트셀러", subtitle: "고객이 가장 사랑하는 상품." },
    blogs: { kicker: "MEER 저널", heading: "블로그", subtitle: "스타일 팁, 구매 가이드, 패션 영감." },
    common: { products: "상품" },
    sectionHeadings: {
      fashion: { kicker: "MEER 컬렉션", heading: "패션 상품", subtitle: "최신 패션 컬렉션을 만나보세요." },
      jewellery: { kicker: "MEER 컬렉션", heading: "주얼리 상품", subtitle: "우아한 주얼리와 럭셔리 시계 컬렉션을 만나보세요." },
      bags: { kicker: "가방 및 액세서리", subtitle: "엄선된 {category} 컬렉션을 만나보세요." },
      uk: { kicker: "영국 독점", heading: "영국 컬렉션 상품", subtitle: "영국의 전통, 현대 패션, 프리미엄 액세서리를 만나보세요." },
      india: { kicker: "인도 헤리티지", heading: "인도 컬렉션 상품", subtitle: "수제 전통 패션과 인도에서 영감을 받은 민족 럭셔리를 만나보세요." },
    },
  },
  fa: {
    nav: { categories: "دسته‌بندی‌ها", home: "خانه", newArrivals: "تازه‌ها", indiaCollection: "مجموعه هند", ukCollection: "مجموعه بریتانیا", allCategories: "همه دسته‌بندی‌ها", bestSellers: "پرفروش‌ترین‌ها", blogs: "وبلاگ" },
    categoryMenu: { fashion: "مد و فشن", jewellery: "جواهرات", bags: "کیف و اکسسوری", uk: "مجموعه بریتانیا", india: "مجموعه هند" },
    topBar: { followUs: "ما را دنبال کنید", login: "ورود", registration: "ثبت‌نام" },
    announcement: { line1: "ارسال رایگان جهانی برای سفارش‌های بالای ۱۰۰ دلار", line2: "مجموعه‌های اختصاصی هند و بریتانیا", line3: "خرید پرمیوم • خرید از میر" },
    search: { placeholder: "جستجوی محصولات...", searchLabel: "جستجو", resultsKicker: "جستجو", resultsHeading: "نتایج جستجو", found: "{count} محصول برای \"{term}\" یافت شد", notFound: "محصولی برای \"{term}\" یافت نشد. کلمه دیگری امتحان کنید.", clear: "← پاک کردن جستجو" },
    header: { compare: "مقایسه", wishlist: "لیست علاقه‌مندی‌ها", cart: "سبد خرید" },
    hero: { shopNow: "همین حالا بخرید" },
    deal: { title: "پیشنهاد امروز", subtitle: "پیشنهادهای محدود", specialOffer: "پیشنهاد ویژه", newArrival: "تازه وارد", viewDeal: "مشاهده پیشنهاد →" },
    collectionStrip: { indiaTitle: "مجموعه هند", indiaDesc: "میراث و هنر دستی", ukTitle: "مجموعه بریتانیا", ukDesc: "ظرافت مدرن", qualityTitle: "کیفیت برتر", qualityDesc: "با دقت انتخاب شده", secureTitle: "خرید امن", secureDesc: "امن و قابل اعتماد" },
    categoriesSection: { kicker: "کاوش در میر", heading: "خرید بر اساس دسته‌بندی", subtitle: "مجموعه‌های با دقت انتخاب‌شده ما را کشف کنید.", explore: "کاوش →" },
    luxury: { indiaKicker: "میراث میر", indiaHeading: "مجموعه هند", indiaDesc: "میراثی بی‌زمان، هنر دستی ظریف و تجملی الهام‌گرفته از هند.", ukKicker: "امضای میر", ukHeading: "مجموعه بریتانیا", ukDesc: "ظرافت مدرن، سبکی پیچیده و تجمل معاصر بریتانیایی.", explore: "مشاهده مجموعه →" },
    back: { allCategories: "← بازگشت به همه دسته‌بندی‌ها", bagsCategories: "← بازگشت به دسته‌بندی کیف‌ها", categories: "← بازگشت به دسته‌بندی‌ها" },
    bagsSection: { kicker: "کیف و اکسسوری", heading: "کاوش دسته‌بندی‌ها", subtitle: "یک مجموعه انتخاب کنید تا محصولات منتخب ما را ببینید." },
    productCard: { addToCart: "+ افزودن به سبد خرید", shopNow: "همین حالا بخرید →", badgeNew: "جدید" },
    productDetail: { perPiece: "/ عدد", shopNow: "همین حالا بخرید →", addWishlist: "♡ افزودن به علاقه‌مندی‌ها", inWishlist: "♥ در علاقه‌مندی‌ها", addCompare: "⇄ افزودن به مقایسه", inCompare: "⇄ در مقایسه" },
    cart: { title: "سبد خرید", emptyTitle: "سبد خرید شما خالی است", emptyText: "محصولاتی به سبد خرید اضافه کنید تا اینجا نمایش داده شوند.", continueShopping: "ادامه خرید", total: "جمع کل", proceedCheckout: "ادامه به تسویه حساب", remove: "حذف" },
    wishlist: { title: "لیست علاقه‌مندی‌های من", emptyTitle: "لیست علاقه‌مندی‌های شما خالی است", emptyText: "روی علامت قلب هر محصول ضربه بزنید تا اینجا ذخیره شود.", moveToCart: "انتقال به سبد خرید", remove: "حذف" },
    compare: { title: "مقایسه محصولات", emptyTitle: "محصولی برای مقایسه وجود ندارد", emptyText: "روی آیکون ⇄ حداکثر ۳ محصول بزنید تا اینجا مقایسه شوند.", product: "محصول", name: "نام", price: "قیمت", category: "دسته‌بندی", details: "جزئیات", addToCart: "افزودن به سبد خرید", remove: "حذف" },
    checkout: { backToCart: "← بازگشت به سبد خرید", heading: "تکمیل سفارش شما", subtitle: "لطفاً اطلاعات خود را برای ادامه خرید وارد کنید.", fullName: "نام کامل", email: "آدرس ایمیل", phone: "شماره تلفن", address: "آدرس تحویل", city: "شهر", placeName: "نام کامل خود را وارد کنید", placeEmail: "ایمیل خود را وارد کنید", placePhone: "شماره تلفن خود را وارد کنید", placeAddress: "آدرس کامل تحویل را وارد کنید", placeCity: "شهر شما", placeOrder: "ثبت سفارش", yourOrder: "سفارش شما", quantity: "تعداد", total: "جمع کل" },
    orderSuccess: { thankYou: "متشکریم", message: "سفارش شما با موفقیت ثبت شد.", orderId: "شماره سفارش:", total: "جمع کل:", continueShopping: "ادامه خرید" },
    newArrivals: { kicker: "تازه وارد", heading: "تازه‌ها", subtitle: "جدیدترین محصولات ما از هر مجموعه." },
    bestSellers: { kicker: "برترین انتخاب‌ها", heading: "پرفروش‌ترین‌ها", subtitle: "محبوب‌ترین محصولات انتخاب‌شده توسط مشتریان ما." },
    blogs: { kicker: "مجله میر", heading: "وبلاگ", subtitle: "نکات استایل، راهنمای خرید و الهام مد." },
    common: { products: "محصولات" },
    sectionHeadings: {
      fashion: { kicker: "مجموعه میر", heading: "محصولات مد", subtitle: "جدیدترین مجموعه مد ما را کشف کنید." },
      jewellery: { kicker: "مجموعه میر", heading: "محصولات جواهرات", subtitle: "مجموعه شیک جواهرات و ساعت‌های لوکس ما را کشف کنید." },
      bags: { kicker: "کیف و اکسسوری", subtitle: "مجموعه منتخب {category} ما را کشف کنید." },
      uk: { kicker: "اختصاصی بریتانیا", heading: "محصولات مجموعه بریتانیا", subtitle: "میراث بریتانیایی، مد مدرن و اکسسوری‌های پرمیوم را کشف کنید." },
      india: { kicker: "میراث هند", heading: "محصولات مجموعه هند", subtitle: "مد سنتی دست‌ساز و تجمل قومی الهام‌گرفته از هند را کشف کنید." },
    },
  },
  bn: {
    nav: { categories: "বিভাগসমূহ", home: "হোম", newArrivals: "নতুন সংগ্রহ", indiaCollection: "ইন্ডিয়া কালেকশন", ukCollection: "ইউকে কালেকশন", allCategories: "সব বিভাগ", bestSellers: "সর্বাধিক বিক্রিত", blogs: "ব্লগ" },
    categoryMenu: { fashion: "ফ্যাশন", jewellery: "জুয়েলারি", bags: "ব্যাগ ও এক্সেসরিজ", uk: "ইউকে কালেকশন", india: "ইন্ডিয়া কালেকশন" },
    topBar: { followUs: "আমাদের ফলো করুন", login: "লগইন", registration: "নিবন্ধন" },
    announcement: { line1: "$১০০ এর বেশি অর্ডারে বিশ্বব্যাপী ফ্রি শিপিং", line2: "এক্সক্লুসিভ ইন্ডিয়া ও ইউকে কালেকশন", line3: "প্রিমিয়াম কিনুন • MEER থেকে কিনুন" },
    search: { placeholder: "পণ্য খুঁজুন...", searchLabel: "খুঁজুন", resultsKicker: "অনুসন্ধান", resultsHeading: "অনুসন্ধান ফলাফল", found: "\"{term}\" এর জন্য {count}টি পণ্য পাওয়া গেছে", notFound: "\"{term}\" এর জন্য কোনো পণ্য পাওয়া যায়নি। অন্য শব্দ চেষ্টা করুন।", clear: "← অনুসন্ধান মুছুন" },
    header: { compare: "তুলনা", wishlist: "উইশলিস্ট", cart: "কার্ট" },
    hero: { shopNow: "এখনই কিনুন" },
    deal: { title: "আজকের অফার", subtitle: "সীমিত সময়ের অফার", specialOffer: "বিশেষ অফার", newArrival: "নতুন", viewDeal: "অফার দেখুন →" },
    collectionStrip: { indiaTitle: "ইন্ডিয়া কালেকশন", indiaDesc: "ঐতিহ্য ও কারুশিল্প", ukTitle: "ইউকে কালেকশন", ukDesc: "আধুনিক কমনীয়তা", qualityTitle: "প্রিমিয়াম মান", qualityDesc: "যত্নসহকারে নির্বাচিত", secureTitle: "নিরাপদ কেনাকাটা", secureDesc: "নিরাপদ ও নির্ভরযোগ্য" },
    categoriesSection: { kicker: "MEER অন্বেষণ করুন", heading: "বিভাগ অনুযায়ী কিনুন", subtitle: "আমাদের যত্নসহকারে নির্বাচিত সংগ্রহ আবিষ্কার করুন।", explore: "অন্বেষণ করুন →" },
    luxury: { indiaKicker: "MEER ঐতিহ্য", indiaHeading: "ইন্ডিয়া কালেকশন", indiaDesc: "চিরকালীন ঐতিহ্য, পরিশীলিত কারুশিল্প এবং ভারত থেকে অনুপ্রাণিত বিলাসিতা।", ukKicker: "MEER স্বাক্ষর", ukHeading: "ইউকে কালেকশন", ukDesc: "আধুনিক কমনীয়তা, পরিশীলিত শৈলী এবং সমসাময়িক ব্রিটিশ বিলাসিতা।", explore: "কালেকশন দেখুন →" },
    back: { allCategories: "← সব বিভাগে ফিরে যান", bagsCategories: "← ব্যাগ বিভাগে ফিরে যান", categories: "← বিভাগে ফিরে যান" },
    bagsSection: { kicker: "ব্যাগ ও এক্সেসরিজ", heading: "বিভাগ অন্বেষণ করুন", subtitle: "আমাদের নির্বাচিত পণ্য দেখতে একটি সংগ্রহ বেছে নিন।" },
    productCard: { addToCart: "+ কার্টে যোগ করুন", shopNow: "এখনই কিনুন →", badgeNew: "নতুন" },
    productDetail: { perPiece: "/ পিস", shopNow: "এখনই কিনুন →", addWishlist: "♡ উইশলিস্টে যোগ করুন", inWishlist: "♥ উইশলিস্টে আছে", addCompare: "⇄ তুলনায় যোগ করুন", inCompare: "⇄ তুলনায় আছে" },
    cart: { title: "শপিং কার্ট", emptyTitle: "আপনার কার্ট খালি", emptyText: "কার্টে কিছু পণ্য যোগ করুন, সেগুলো এখানে দেখাবে।", continueShopping: "কেনাকাটা চালিয়ে যান", total: "মোট", proceedCheckout: "চেকআউটে যান", remove: "সরান" },
    wishlist: { title: "আমার উইশলিস্ট", emptyTitle: "আপনার উইশলিস্ট খালি", emptyText: "কোনো পণ্য এখানে সংরক্ষণ করতে হার্ট আইকনে ট্যাপ করুন।", moveToCart: "কার্টে সরান", remove: "সরান" },
    compare: { title: "পণ্য তুলনা করুন", emptyTitle: "তুলনার জন্য কোনো পণ্য নেই", emptyText: "এখানে তুলনা করতে ৩টি পর্যন্ত পণ্যে ⇄ আইকনে ট্যাপ করুন।", product: "পণ্য", name: "নাম", price: "মূল্য", category: "বিভাগ", details: "বিবরণ", addToCart: "কার্টে যোগ করুন", remove: "সরান" },
    checkout: { backToCart: "← কার্টে ফিরে যান", heading: "আপনার অর্ডার সম্পূর্ণ করুন", subtitle: "কেনাকাটা চালিয়ে যেতে আপনার তথ্য লিখুন।", fullName: "পূর্ণ নাম", email: "ইমেল ঠিকানা", phone: "ফোন নম্বর", address: "ডেলিভারি ঠিকানা", city: "শহর", placeName: "আপনার পূর্ণ নাম লিখুন", placeEmail: "আপনার ইমেল লিখুন", placePhone: "আপনার ফোন নম্বর লিখুন", placeAddress: "আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন", placeCity: "আপনার শহর", placeOrder: "অর্ডার করুন", yourOrder: "আপনার অর্ডার", quantity: "পরিমাণ", total: "মোট" },
    orderSuccess: { thankYou: "ধন্যবাদ", message: "আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে।", orderId: "অর্ডার আইডি:", total: "মোট:", continueShopping: "কেনাকাটা চালিয়ে যান" },
    newArrivals: { kicker: "নতুন এসেছে", heading: "নতুন সংগ্রহ", subtitle: "প্রতিটি সংগ্রহ থেকে আমাদের সর্বশেষ পণ্য।" },
    bestSellers: { kicker: "সেরা পছন্দ", heading: "সর্বাধিক বিক্রিত", subtitle: "আমাদের গ্রাহকদের দ্বারা নির্বাচিত সবচেয়ে প্রিয় পণ্য।" },
    blogs: { kicker: "MEER জার্নাল", heading: "ব্লগ", subtitle: "স্টাইল টিপস, কেনাকাটার গাইড এবং ফ্যাশন অনুপ্রেরণা।" },
    common: { products: "পণ্য" },
    sectionHeadings: {
      fashion: { kicker: "MEER কালেকশন", heading: "ফ্যাশন পণ্য", subtitle: "আমাদের সর্বশেষ ফ্যাশন সংগ্রহ আবিষ্কার করুন।" },
      jewellery: { kicker: "MEER কালেকশন", heading: "জুয়েলারি পণ্য", subtitle: "আমাদের মার্জিত জুয়েলারি ও বিলাসবহুল ঘড়ি সংগ্রহ আবিষ্কার করুন।" },
      bags: { kicker: "ব্যাগ ও এক্সেসরিজ", subtitle: "আমাদের নির্বাচিত {category} সংগ্রহ আবিষ্কার করুন।" },
      uk: { kicker: "ইউকে এক্সক্লুসিভ", heading: "ইউকে কালেকশন পণ্য", subtitle: "ব্রিটিশ ঐতিহ্য, আধুনিক ফ্যাশন এবং প্রিমিয়াম এক্সেসরিজ আবিষ্কার করুন।" },
      india: { kicker: "ইন্ডিয়া ঐতিহ্য", heading: "ইন্ডিয়া কালেকশন পণ্য", subtitle: "হাতে তৈরি ঐতিহ্যবাহী ফ্যাশন এবং ভারত থেকে অনুপ্রাণিত জাতিগত বিলাসিতা আবিষ্কার করুন।" },
    },
  },
  pa: {
    nav: { categories: "ਸ਼੍ਰੇਣੀਆਂ", home: "ਹੋਮ", newArrivals: "ਨਵੇਂ ਆਏ", indiaCollection: "ਇੰਡੀਆ ਕਲੈਕਸ਼ਨ", ukCollection: "ਯੂਕੇ ਕਲੈਕਸ਼ਨ", allCategories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ", bestSellers: "ਸਭ ਤੋਂ ਵੱਧ ਵਿਕਣ ਵਾਲੇ", blogs: "ਬਲੌਗ" },
    categoryMenu: { fashion: "ਫੈਸ਼ਨ", jewellery: "ਜਵੈਲਰੀ", bags: "ਬੈਗ ਅਤੇ ਐਕਸੈਸਰੀਜ਼", uk: "ਯੂਕੇ ਕਲੈਕਸ਼ਨ", india: "ਇੰਡੀਆ ਕਲੈਕਸ਼ਨ" },
    topBar: { followUs: "ਸਾਨੂੰ ਫਾਲੋ ਕਰੋ", login: "ਲੌਗਇਨ", registration: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ" },
    announcement: { line1: "$100 ਤੋਂ ਵੱਧ ਆਰਡਰ 'ਤੇ ਮੁਫਤ ਵਿਸ਼ਵਵਿਆਪੀ ਸ਼ਿਪਿੰਗ", line2: "ਵਿਸ਼ੇਸ਼ ਇੰਡੀਆ ਅਤੇ ਯੂਕੇ ਕਲੈਕਸ਼ਨ", line3: "ਪ੍ਰੀਮੀਅਮ ਖਰੀਦੋ • MEER ਤੋਂ ਖਰੀਦੋ" },
    search: { placeholder: "ਉਤਪਾਦ ਖੋਜੋ...", searchLabel: "ਖੋਜ", resultsKicker: "ਖੋਜ", resultsHeading: "ਖੋਜ ਨਤੀਜੇ", found: "\"{term}\" ਲਈ {count} ਉਤਪਾਦ ਮਿਲੇ", notFound: "\"{term}\" ਲਈ ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ ਮਿਲਿਆ। ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਅਜ਼ਮਾਓ।", clear: "← ਖੋਜ ਸਾਫ਼ ਕਰੋ" },
    header: { compare: "ਤੁਲਨਾ", wishlist: "ਵਿਸ਼ਲਿਸਟ", cart: "ਕਾਰਟ" },
    hero: { shopNow: "ਹੁਣੇ ਖਰੀਦੋ" },
    deal: { title: "ਅੱਜ ਦੀ ਪੇਸ਼ਕਸ਼", subtitle: "ਸੀਮਤ ਸਮੇਂ ਦੀ ਪੇਸ਼ਕਸ਼", specialOffer: "ਖਾਸ ਪੇਸ਼ਕਸ਼", newArrival: "ਨਵਾਂ", viewDeal: "ਪੇਸ਼ਕਸ਼ ਵੇਖੋ →" },
    collectionStrip: { indiaTitle: "ਇੰਡੀਆ ਕਲੈਕਸ਼ਨ", indiaDesc: "ਵਿਰਾਸਤ ਅਤੇ ਹੁਨਰ", ukTitle: "ਯੂਕੇ ਕਲੈਕਸ਼ਨ", ukDesc: "ਆਧੁਨਿਕ ਸੁੰਦਰਤਾ", qualityTitle: "ਪ੍ਰੀਮੀਅਮ ਗੁਣਵੱਤਾ", qualityDesc: "ਧਿਆਨ ਨਾਲ ਚੁਣਿਆ ਗਿਆ", secureTitle: "ਸੁਰੱਖਿਅਤ ਖਰੀਦਦਾਰੀ", secureDesc: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਭਰੋਸੇਯੋਗ" },
    categoriesSection: { kicker: "MEER ਖੋਜੋ", heading: "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਖਰੀਦੋ", subtitle: "ਸਾਡੇ ਧਿਆਨ ਨਾਲ ਚੁਣੇ ਗਏ ਸੰਗ੍ਰਹਿ ਖੋਜੋ।", explore: "ਖੋਜੋ →" },
    luxury: { indiaKicker: "MEER ਵਿਰਾਸਤ", indiaHeading: "ਇੰਡੀਆ ਕਲੈਕਸ਼ਨ", indiaDesc: "ਸਦੀਵੀ ਵਿਰਾਸਤ, ਨਿਪੁੰਨ ਹੁਨਰ ਅਤੇ ਭਾਰਤ ਤੋਂ ਪ੍ਰੇਰਿਤ ਲਗਜ਼ਰੀ।", ukKicker: "MEER ਦਸਤਖਤ", ukHeading: "ਯੂਕੇ ਕਲੈਕਸ਼ਨ", ukDesc: "ਆਧੁਨਿਕ ਸੁੰਦਰਤਾ, ਸੁਧਰੀ ਸ਼ੈਲੀ ਅਤੇ ਸਮਕਾਲੀ ਬ੍ਰਿਟਿਸ਼ ਲਗਜ਼ਰੀ।", explore: "ਸੰਗ੍ਰਹਿ ਵੇਖੋ →" },
    back: { allCategories: "← ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ 'ਤੇ ਵਾਪਸ ਜਾਓ", bagsCategories: "← ਬੈਗ ਸ਼੍ਰੇਣੀਆਂ 'ਤੇ ਵਾਪਸ ਜਾਓ", categories: "← ਸ਼੍ਰੇਣੀਆਂ 'ਤੇ ਵਾਪਸ ਜਾਓ" },
    bagsSection: { kicker: "ਬੈਗ ਅਤੇ ਐਕਸੈਸਰੀਜ਼", heading: "ਸ਼੍ਰੇਣੀਆਂ ਖੋਜੋ", subtitle: "ਸਾਡੇ ਚੁਣੇ ਗਏ ਉਤਪਾਦ ਵੇਖਣ ਲਈ ਇੱਕ ਸੰਗ੍ਰਹਿ ਚੁਣੋ।" },
    productCard: { addToCart: "+ ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ", shopNow: "ਹੁਣੇ ਖਰੀਦੋ →", badgeNew: "ਨਵਾਂ" },
    productDetail: { perPiece: "/ ਪੀਸ", shopNow: "ਹੁਣੇ ਖਰੀਦੋ →", addWishlist: "♡ ਵਿਸ਼ਲਿਸਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ", inWishlist: "♥ ਵਿਸ਼ਲਿਸਟ ਵਿੱਚ ਹੈ", addCompare: "⇄ ਤੁਲਨਾ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ", inCompare: "⇄ ਤੁਲਨਾ ਵਿੱਚ ਹੈ" },
    cart: { title: "ਸ਼ਾਪਿੰਗ ਕਾਰਟ", emptyTitle: "ਤੁਹਾਡੀ ਕਾਰਟ ਖਾਲੀ ਹੈ", emptyText: "ਆਪਣੀ ਕਾਰਟ ਵਿੱਚ ਕੁਝ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ, ਉਹ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।", continueShopping: "ਖਰੀਦਦਾਰੀ ਜਾਰੀ ਰੱਖੋ", total: "ਕੁੱਲ", proceedCheckout: "ਚੈਕਆਉਟ 'ਤੇ ਜਾਓ", remove: "ਹਟਾਓ" },
    wishlist: { title: "ਮੇਰੀ ਵਿਸ਼ਲਿਸਟ", emptyTitle: "ਤੁਹਾਡੀ ਵਿਸ਼ਲਿਸਟ ਖਾਲੀ ਹੈ", emptyText: "ਕਿਸੇ ਵੀ ਉਤਪਾਦ ਨੂੰ ਇੱਥੇ ਸੇਵ ਕਰਨ ਲਈ ਦਿਲ 'ਤੇ ਟੈਪ ਕਰੋ।", moveToCart: "ਕਾਰਟ ਵਿੱਚ ਭੇਜੋ", remove: "ਹਟਾਓ" },
    compare: { title: "ਉਤਪਾਦਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ", emptyTitle: "ਤੁਲਨਾ ਲਈ ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ", emptyText: "ਇੱਥੇ ਤੁਲਨਾ ਕਰਨ ਲਈ 3 ਉਤਪਾਦਾਂ ਤੱਕ ⇄ ਆਈਕਨ 'ਤੇ ਟੈਪ ਕਰੋ।", product: "ਉਤਪਾਦ", name: "ਨਾਮ", price: "ਕੀਮਤ", category: "ਸ਼੍ਰੇਣੀ", details: "ਵੇਰਵੇ", addToCart: "ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ", remove: "ਹਟਾਓ" },
    checkout: { backToCart: "← ਕਾਰਟ 'ਤੇ ਵਾਪਸ ਜਾਓ", heading: "ਆਪਣਾ ਆਰਡਰ ਪੂਰਾ ਕਰੋ", subtitle: "ਖਰੀਦਦਾਰੀ ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ।", fullName: "ਪੂਰਾ ਨਾਮ", email: "ਈਮੇਲ ਪਤਾ", phone: "ਫੋਨ ਨੰਬਰ", address: "ਡਿਲਿਵਰੀ ਪਤਾ", city: "ਸ਼ਹਿਰ", placeName: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ", placeEmail: "ਆਪਣੀ ਈਮੇਲ ਦਰਜ ਕਰੋ", placePhone: "ਆਪਣਾ ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ", placeAddress: "ਆਪਣਾ ਪੂਰਾ ਡਿਲਿਵਰੀ ਪਤਾ ਦਰਜ ਕਰੋ", placeCity: "ਤੁਹਾਡਾ ਸ਼ਹਿਰ", placeOrder: "ਆਰਡਰ ਕਰੋ", yourOrder: "ਤੁਹਾਡਾ ਆਰਡਰ", quantity: "ਮਾਤਰਾ", total: "ਕੁੱਲ" },
    orderSuccess: { thankYou: "ਧੰਨਵਾਦ", message: "ਤੁਹਾਡਾ ਆਰਡਰ ਸਫਲਤਾਪੂਰਵਕ ਹੋ ਗਿਆ ਹੈ।", orderId: "ਆਰਡਰ ਆਈਡੀ:", total: "ਕੁੱਲ:", continueShopping: "ਖਰੀਦਦਾਰੀ ਜਾਰੀ ਰੱਖੋ" },
    newArrivals: { kicker: "ਹੁਣੇ ਆਏ", heading: "ਨਵੇਂ ਆਏ", subtitle: "ਹਰ ਸੰਗ੍ਰਹਿ ਤੋਂ ਸਾਡੇ ਨਵੀਨਤਮ ਉਤਪਾਦ।" },
    bestSellers: { kicker: "ਚੋਟੀ ਦੀਆਂ ਚੋਣਾਂ", heading: "ਸਭ ਤੋਂ ਵੱਧ ਵਿਕਣ ਵਾਲੇ", subtitle: "ਸਾਡੇ ਗਾਹਕਾਂ ਦੁਆਰਾ ਚੁਣੇ ਗਏ ਸਭ ਤੋਂ ਪਸੰਦੀਦਾ ਉਤਪਾਦ।" },
    blogs: { kicker: "MEER ਜਰਨਲ", heading: "ਬਲੌਗ", subtitle: "ਸਟਾਈਲ ਸੁਝਾਅ, ਖਰੀਦਦਾਰੀ ਗਾਈਡ ਅਤੇ ਫੈਸ਼ਨ ਪ੍ਰੇਰਨਾ।" },
    common: { products: "ਉਤਪਾਦ" },
    sectionHeadings: {
      fashion: { kicker: "MEER ਕਲੈਕਸ਼ਨ", heading: "ਫੈਸ਼ਨ ਉਤਪਾਦ", subtitle: "ਸਾਡਾ ਨਵੀਨਤਮ ਫੈਸ਼ਨ ਸੰਗ੍ਰਹਿ ਖੋਜੋ।" },
      jewellery: { kicker: "MEER ਕਲੈਕਸ਼ਨ", heading: "ਜਵੈਲਰੀ ਉਤਪਾਦ", subtitle: "ਸਾਡਾ ਸ਼ਾਨਦਾਰ ਜਵੈਲਰੀ ਅਤੇ ਲਗਜ਼ਰੀ ਘੜੀ ਸੰਗ੍ਰਹਿ ਖੋਜੋ।" },
      bags: { kicker: "ਬੈਗ ਅਤੇ ਐਕਸੈਸਰੀਜ਼", subtitle: "ਸਾਡਾ ਚੁਣਿਆ ਗਿਆ {category} ਸੰਗ੍ਰਹਿ ਖੋਜੋ।" },
      uk: { kicker: "ਯੂਕੇ ਐਕਸਕਲੂਸਿਵ", heading: "ਯੂਕੇ ਕਲੈਕਸ਼ਨ ਉਤਪਾਦ", subtitle: "ਬ੍ਰਿਟਿਸ਼ ਵਿਰਾਸਤ, ਆਧੁਨਿਕ ਫੈਸ਼ਨ ਅਤੇ ਪ੍ਰੀਮੀਅਮ ਐਕਸੈਸਰੀਜ਼ ਖੋਜੋ।" },
      india: { kicker: "ਇੰਡੀਆ ਵਿਰਾਸਤ", heading: "ਇੰਡੀਆ ਕਲੈਕਸ਼ਨ ਉਤਪਾਦ", subtitle: "ਹੱਥ ਨਾਲ ਬਣੇ ਰਵਾਇਤੀ ਫੈਸ਼ਨ ਅਤੇ ਭਾਰਤ ਤੋਂ ਪ੍ਰੇਰਿਤ ਨਸਲੀ ਲਗਜ਼ਰੀ ਖੋਜੋ।" },
    },
  },
  id: {
    nav: { categories: "Kategori", home: "Beranda", newArrivals: "Produk Baru", indiaCollection: "Koleksi India", ukCollection: "Koleksi UK", allCategories: "Semua Kategori", bestSellers: "Terlaris", blogs: "Blog" },
    categoryMenu: { fashion: "Fashion", jewellery: "Perhiasan", bags: "Tas & Aksesoris", uk: "Koleksi UK", india: "Koleksi India" },
    topBar: { followUs: "Ikuti kami", login: "Masuk", registration: "Daftar" },
    announcement: { line1: "GRATIS ONGKIR SELURUH DUNIA UNTUK PESANAN DI ATAS $100", line2: "KOLEKSI EKSKLUSIF INDIA & UK", line3: "BELANJA PREMIUM • BELANJA MEER" },
    search: { placeholder: "Cari produk...", searchLabel: "Cari", resultsKicker: "PENCARIAN", resultsHeading: "Hasil Pencarian", found: "{count} produk ditemukan untuk \"{term}\"", notFound: "Tidak ada produk ditemukan untuk \"{term}\". Coba kata lain.", clear: "← Hapus Pencarian" },
    header: { compare: "Bandingkan", wishlist: "Wishlist", cart: "Keranjang" },
    hero: { shopNow: "BELANJA SEKARANG" },
    deal: { title: "Penawaran Hari Ini", subtitle: "Penawaran waktu terbatas", specialOffer: "PENAWARAN KHUSUS", newArrival: "BARU", viewDeal: "Lihat Penawaran →" },
    collectionStrip: { indiaTitle: "Koleksi India", indiaDesc: "Warisan & keahlian", ukTitle: "Koleksi UK", ukDesc: "Keanggunan modern", qualityTitle: "Kualitas Premium", qualityDesc: "Dipilih dengan cermat", secureTitle: "Belanja Aman", secureDesc: "Aman & terpercaya" },
    categoriesSection: { kicker: "JELAJAHI MEER", heading: "Belanja Berdasarkan Kategori", subtitle: "Temukan koleksi kami yang dipilih dengan cermat.", explore: "Jelajahi →" },
    luxury: { indiaKicker: "WARISAN MEER", indiaHeading: "Koleksi India", indiaDesc: "Warisan abadi, keahlian yang halus, dan kemewahan yang terinspirasi dari India.", ukKicker: "SIGNATURE MEER", ukHeading: "Koleksi UK", ukDesc: "Keanggunan modern, gaya canggih, dan kemewahan Inggris kontemporer.", explore: "Jelajahi Koleksi →" },
    back: { allCategories: "← Kembali ke Semua Kategori", bagsCategories: "← Kembali ke Kategori Tas", categories: "← Kembali ke Kategori" },
    bagsSection: { kicker: "TAS & AKSESORIS", heading: "Jelajahi Kategori", subtitle: "Pilih koleksi untuk menjelajahi produk pilihan kami." },
    productCard: { addToCart: "+ Tambah ke Keranjang", shopNow: "BELANJA SEKARANG →", badgeNew: "BARU" },
    productDetail: { perPiece: "/ pcs", shopNow: "BELANJA SEKARANG →", addWishlist: "♡ Tambah ke Wishlist", inWishlist: "♥ Di Wishlist", addCompare: "⇄ Tambah ke Perbandingan", inCompare: "⇄ Di Perbandingan" },
    cart: { title: "Keranjang Belanja", emptyTitle: "Keranjang Anda kosong", emptyText: "Tambahkan produk ke keranjang Anda dan akan muncul di sini.", continueShopping: "Lanjutkan Belanja", total: "Total", proceedCheckout: "Lanjut ke Checkout", remove: "Hapus" },
    wishlist: { title: "Wishlist Saya", emptyTitle: "Wishlist Anda kosong", emptyText: "Ketuk ikon hati pada produk apa pun untuk menyimpannya di sini.", moveToCart: "Pindahkan ke Keranjang", remove: "Hapus" },
    compare: { title: "Bandingkan Produk", emptyTitle: "Tidak ada produk untuk dibandingkan", emptyText: "Ketuk ikon ⇄ pada hingga 3 produk untuk membandingkannya di sini.", product: "Produk", name: "Nama", price: "Harga", category: "Kategori", details: "Detail", addToCart: "Tambah ke Keranjang", remove: "Hapus" },
    checkout: { backToCart: "← Kembali ke Keranjang", heading: "Selesaikan Pesanan Anda", subtitle: "Masukkan detail Anda untuk melanjutkan pembelian.", fullName: "Nama Lengkap", email: "Alamat Email", phone: "Nomor Telepon", address: "Alamat Pengiriman", city: "Kota", placeName: "Masukkan nama lengkap Anda", placeEmail: "Masukkan email Anda", placePhone: "Masukkan nomor telepon Anda", placeAddress: "Masukkan alamat pengiriman lengkap Anda", placeCity: "Kota Anda", placeOrder: "Buat Pesanan", yourOrder: "Pesanan Anda", quantity: "Jumlah", total: "Total" },
    orderSuccess: { thankYou: "Terima kasih", message: "Pesanan Anda berhasil dibuat.", orderId: "ID Pesanan:", total: "Total:", continueShopping: "Lanjutkan Belanja" },
    newArrivals: { kicker: "BARU DATANG", heading: "Produk Baru", subtitle: "Produk terbaru kami dari setiap koleksi." },
    bestSellers: { kicker: "PILIHAN TERBAIK", heading: "Terlaris", subtitle: "Produk paling disukai pilihan pelanggan kami." },
    blogs: { kicker: "JURNAL MEER", heading: "Blog", subtitle: "Tips gaya, panduan belanja, dan inspirasi fashion." },
    common: { products: "Produk" },
    sectionHeadings: {
      fashion: { kicker: "KOLEKSI MEER", heading: "Produk Fashion", subtitle: "Temukan koleksi fashion terbaru kami." },
      jewellery: { kicker: "KOLEKSI MEER", heading: "Produk Perhiasan", subtitle: "Temukan koleksi perhiasan elegan dan jam tangan mewah kami." },
      bags: { kicker: "TAS & AKSESORIS", subtitle: "Temukan koleksi {category} pilihan kami." },
      uk: { kicker: "EKSKLUSIF UK", heading: "Produk Koleksi UK", subtitle: "Temukan warisan Inggris, fashion modern, dan aksesoris premium." },
      india: { kicker: "WARISAN INDIA", heading: "Produk Koleksi India", subtitle: "Temukan fashion tradisional buatan tangan dan kemewahan etnik yang terinspirasi dari India." },
    },
  },
  nl: {
    nav: { categories: "Categorieën", home: "Home", newArrivals: "Nieuwe Collectie", indiaCollection: "India Collectie", ukCollection: "UK Collectie", allCategories: "Alle Categorieën", bestSellers: "Bestsellers", blogs: "Blogs" },
    categoryMenu: { fashion: "Mode", jewellery: "Sieraden", bags: "Tassen & Accessoires", uk: "UK Collectie", india: "India Collectie" },
    topBar: { followUs: "Volg ons", login: "Inloggen", registration: "Registreren" },
    announcement: { line1: "GRATIS WERELDWIJDE VERZENDING BIJ BESTELLINGEN BOVEN $100", line2: "EXCLUSIEVE INDIA- EN UK-COLLECTIES", line3: "KOOP PREMIUM • KOOP MEER" },
    search: { placeholder: "Zoek producten...", searchLabel: "Zoeken", resultsKicker: "ZOEKEN", resultsHeading: "Zoekresultaten", found: "{count} product(en) gevonden voor \"{term}\"", notFound: "Geen producten gevonden voor \"{term}\". Probeer een ander woord.", clear: "← Zoekopdracht wissen" },
    header: { compare: "Vergelijken", wishlist: "Verlanglijst", cart: "Winkelwagen" },
    hero: { shopNow: "NU KOPEN" },
    deal: { title: "Deal van de Dag", subtitle: "Tijdelijke aanbiedingen", specialOffer: "SPECIALE AANBIEDING", newArrival: "NIEUW", viewDeal: "Bekijk Deal →" },
    collectionStrip: { indiaTitle: "India Collectie", indiaDesc: "Erfgoed & vakmanschap", ukTitle: "UK Collectie", ukDesc: "Moderne elegantie", qualityTitle: "Premium Kwaliteit", qualityDesc: "Zorgvuldig geselecteerd", secureTitle: "Veilig Winkelen", secureDesc: "Veilig & betrouwbaar" },
    categoriesSection: { kicker: "ONTDEK MEER", heading: "Winkel per Categorie", subtitle: "Ontdek onze zorgvuldig geselecteerde collecties.", explore: "Ontdekken →" },
    luxury: { indiaKicker: "MEER ERFGOED", indiaHeading: "India Collectie", indiaDesc: "Tijdloos erfgoed, verfijnd vakmanschap en luxe geïnspireerd op India.", ukKicker: "MEER SIGNATURE", ukHeading: "UK Collectie", ukDesc: "Moderne elegantie, verfijnde stijl en hedendaagse Britse luxe.", explore: "Collectie Ontdekken →" },
    back: { allCategories: "← Terug naar Alle Categorieën", bagsCategories: "← Terug naar Tassencategorieën", categories: "← Terug naar Categorieën" },
    bagsSection: { kicker: "TASSEN & ACCESSOIRES", heading: "Ontdek Categorieën", subtitle: "Kies een collectie om onze geselecteerde producten te ontdekken." },
    productCard: { addToCart: "+ In Winkelwagen", shopNow: "NU KOPEN →", badgeNew: "NIEUW" },
    productDetail: { perPiece: "/ stuk", shopNow: "NU KOPEN →", addWishlist: "♡ Aan Verlanglijst Toevoegen", inWishlist: "♥ Op Verlanglijst", addCompare: "⇄ Toevoegen aan Vergelijking", inCompare: "⇄ In Vergelijking" },
    cart: { title: "Winkelwagen", emptyTitle: "Uw winkelwagen is leeg", emptyText: "Voeg producten toe aan uw winkelwagen en ze verschijnen hier.", continueShopping: "Verder Winkelen", total: "Totaal", proceedCheckout: "Naar Afrekenen", remove: "Verwijderen" },
    wishlist: { title: "Mijn Verlanglijst", emptyTitle: "Uw verlanglijst is leeg", emptyText: "Tik op het hartje bij een product om het hier op te slaan.", moveToCart: "Verplaats naar Winkelwagen", remove: "Verwijderen" },
    compare: { title: "Producten Vergelijken", emptyTitle: "Geen producten om te vergelijken", emptyText: "Tik op het ⇄ icoon bij maximaal 3 producten om ze hier te vergelijken.", product: "Product", name: "Naam", price: "Prijs", category: "Categorie", details: "Details", addToCart: "In Winkelwagen", remove: "Verwijderen" },
    checkout: { backToCart: "← Terug naar Winkelwagen", heading: "Voltooi Uw Bestelling", subtitle: "Voer uw gegevens in om door te gaan met uw aankoop.", fullName: "Volledige Naam", email: "E-mailadres", phone: "Telefoonnummer", address: "Bezorgadres", city: "Stad", placeName: "Voer uw volledige naam in", placeEmail: "Voer uw e-mail in", placePhone: "Voer uw telefoonnummer in", placeAddress: "Voer uw volledige bezorgadres in", placeCity: "Uw stad", placeOrder: "Bestelling Plaatsen", yourOrder: "Uw Bestelling", quantity: "Aantal", total: "Totaal" },
    orderSuccess: { thankYou: "Bedankt", message: "Uw bestelling is succesvol geplaatst.", orderId: "Bestel-ID:", total: "Totaal:", continueShopping: "Verder Winkelen" },
    newArrivals: { kicker: "NET BINNEN", heading: "Nieuwe Collectie", subtitle: "Onze nieuwste producten uit elke collectie." },
    bestSellers: { kicker: "TOPKEUZES", heading: "Bestsellers", subtitle: "De meest geliefde producten gekozen door onze klanten." },
    blogs: { kicker: "MEER JOURNAAL", heading: "Blogs", subtitle: "Stijltips, koopgidsen en modeinspiratie." },
    common: { products: "Producten" },
    sectionHeadings: {
      fashion: { kicker: "MEER COLLECTIE", heading: "Modeproducten", subtitle: "Ontdek onze nieuwste modecollectie." },
      jewellery: { kicker: "MEER COLLECTIE", heading: "Sieradenproducten", subtitle: "Ontdek onze elegante sieraden- en luxe horlogecollectie." },
      bags: { kicker: "TASSEN & ACCESSOIRES", subtitle: "Ontdek onze geselecteerde {category}-collectie." },
      uk: { kicker: "UK EXCLUSIEF", heading: "Producten van de UK Collectie", subtitle: "Ontdek Brits erfgoed, moderne mode en premium accessoires." },
      india: { kicker: "INDIA ERFGOED", heading: "Producten van de India Collectie", subtitle: "Ontdek handgemaakte traditionele mode en etnische luxe geïnspireerd op India." },
    },
  },
  vi: {
    nav: { categories: "Danh Mục", home: "Trang Chủ", newArrivals: "Hàng Mới Về", indiaCollection: "Bộ Sưu Tập Ấn Độ", ukCollection: "Bộ Sưu Tập Anh", allCategories: "Tất Cả Danh Mục", bestSellers: "Bán Chạy Nhất", blogs: "Blog" },
    categoryMenu: { fashion: "Thời Trang", jewellery: "Trang Sức", bags: "Túi & Phụ Kiện", uk: "Bộ Sưu Tập Anh", india: "Bộ Sưu Tập Ấn Độ" },
    topBar: { followUs: "Theo Dõi Chúng Tôi", login: "Đăng Nhập", registration: "Đăng Ký" },
    announcement: { line1: "MIỄN PHÍ VẬN CHUYỂN TOÀN CẦU CHO ĐƠN HÀNG TRÊN $100", line2: "BỘ SƯU TẬP ĐỘC QUYỀN ẤN ĐỘ & ANH", line3: "MUA HÀNG CAO CẤP • MUA SẮM TẠI MEER" },
    search: { placeholder: "Tìm kiếm sản phẩm...", searchLabel: "Tìm kiếm", resultsKicker: "TÌM KIẾM", resultsHeading: "Kết Quả Tìm Kiếm", found: "Tìm thấy {count} sản phẩm cho \"{term}\"", notFound: "Không tìm thấy sản phẩm nào cho \"{term}\". Hãy thử từ khác.", clear: "← Xóa Tìm Kiếm" },
    header: { compare: "So Sánh", wishlist: "Danh Sách Yêu Thích", cart: "Giỏ Hàng" },
    hero: { shopNow: "MUA NGAY" },
    deal: { title: "Ưu Đãi Hôm Nay", subtitle: "Ưu đãi có thời hạn", specialOffer: "ƯU ĐÃI ĐẶC BIỆT", newArrival: "HÀNG MỚI", viewDeal: "Xem Ưu Đãi →" },
    collectionStrip: { indiaTitle: "Bộ Sưu Tập Ấn Độ", indiaDesc: "Di sản & thủ công", ukTitle: "Bộ Sưu Tập Anh", ukDesc: "Sự thanh lịch hiện đại", qualityTitle: "Chất Lượng Cao Cấp", qualityDesc: "Được tuyển chọn kỹ lưỡng", secureTitle: "Mua Sắm An Toàn", secureDesc: "An toàn & đáng tin cậy" },
    categoriesSection: { kicker: "KHÁM PHÁ MEER", heading: "Mua Sắm Theo Danh Mục", subtitle: "Khám phá các bộ sưu tập được tuyển chọn kỹ lưỡng của chúng tôi.", explore: "Khám Phá →" },
    luxury: { indiaKicker: "DI SẢN MEER", indiaHeading: "Bộ Sưu Tập Ấn Độ", indiaDesc: "Di sản vượt thời gian, tay nghề tinh xảo và sự sang trọng lấy cảm hứng từ Ấn Độ.", ukKicker: "CHỮ KÝ MEER", ukHeading: "Bộ Sưu Tập Anh", ukDesc: "Sự thanh lịch hiện đại, phong cách tinh tế và sự sang trọng Anh Quốc đương đại.", explore: "Khám Phá Bộ Sưu Tập →" },
    back: { allCategories: "← Quay Lại Tất Cả Danh Mục", bagsCategories: "← Quay Lại Danh Mục Túi", categories: "← Quay Lại Danh Mục" },
    bagsSection: { kicker: "TÚI & PHỤ KIỆN", heading: "Khám Phá Danh Mục", subtitle: "Chọn một bộ sưu tập để khám phá các sản phẩm được tuyển chọn của chúng tôi." },
    productCard: { addToCart: "+ Thêm Vào Giỏ", shopNow: "MUA NGAY →", badgeNew: "MỚI" },
    productDetail: { perPiece: "/ cái", shopNow: "MUA NGAY →", addWishlist: "♡ Thêm Vào Yêu Thích", inWishlist: "♥ Đã Trong Yêu Thích", addCompare: "⇄ Thêm Vào So Sánh", inCompare: "⇄ Đang So Sánh" },
    cart: { title: "Giỏ Hàng", emptyTitle: "Giỏ hàng của bạn trống", emptyText: "Thêm sản phẩm vào giỏ hàng và chúng sẽ xuất hiện ở đây.", continueShopping: "Tiếp Tục Mua Sắm", total: "Tổng Cộng", proceedCheckout: "Tiến Hành Thanh Toán", remove: "Xóa" },
    wishlist: { title: "Danh Sách Yêu Thích Của Tôi", emptyTitle: "Danh sách yêu thích của bạn trống", emptyText: "Nhấn vào biểu tượng trái tim trên bất kỳ sản phẩm nào để lưu tại đây.", moveToCart: "Chuyển Vào Giỏ Hàng", remove: "Xóa" },
    compare: { title: "So Sánh Sản Phẩm", emptyTitle: "Không có sản phẩm để so sánh", emptyText: "Nhấn vào biểu tượng ⇄ trên tối đa 3 sản phẩm để so sánh tại đây.", product: "Sản Phẩm", name: "Tên", price: "Giá", category: "Danh Mục", details: "Chi Tiết", addToCart: "Thêm Vào Giỏ", remove: "Xóa" },
    checkout: { backToCart: "← Quay Lại Giỏ Hàng", heading: "Hoàn Tất Đơn Hàng", subtitle: "Vui lòng nhập thông tin của bạn để tiếp tục mua hàng.", fullName: "Họ Và Tên", email: "Địa Chỉ Email", phone: "Số Điện Thoại", address: "Địa Chỉ Giao Hàng", city: "Thành Phố", placeName: "Nhập họ và tên của bạn", placeEmail: "Nhập email của bạn", placePhone: "Nhập số điện thoại của bạn", placeAddress: "Nhập địa chỉ giao hàng đầy đủ", placeCity: "Thành phố của bạn", placeOrder: "Đặt Hàng", yourOrder: "Đơn Hàng Của Bạn", quantity: "Số Lượng", total: "Tổng Cộng" },
    orderSuccess: { thankYou: "Cảm ơn bạn", message: "Đơn hàng của bạn đã được đặt thành công.", orderId: "Mã Đơn Hàng:", total: "Tổng Cộng:", continueShopping: "Tiếp Tục Mua Sắm" },
    newArrivals: { kicker: "VỪA VỀ", heading: "Hàng Mới Về", subtitle: "Những sản phẩm mới nhất của chúng tôi từ mỗi bộ sưu tập." },
    bestSellers: { kicker: "LỰA CHỌN HÀNG ĐẦU", heading: "Bán Chạy Nhất", subtitle: "Những sản phẩm được khách hàng yêu thích nhất." },
    blogs: { kicker: "TẠP CHÍ MEER", heading: "Blog", subtitle: "Mẹo phong cách, hướng dẫn mua sắm và cảm hứng thời trang." },
    common: { products: "Sản Phẩm" },
    sectionHeadings: {
      fashion: { kicker: "BỘ SƯU TẬP MEER", heading: "Sản Phẩm Thời Trang", subtitle: "Khám phá bộ sưu tập thời trang mới nhất của chúng tôi." },
      jewellery: { kicker: "BỘ SƯU TẬP MEER", heading: "Sản Phẩm Trang Sức", subtitle: "Khám phá bộ sưu tập trang sức thanh lịch và đồng hồ sang trọng của chúng tôi." },
      bags: { kicker: "TÚI & PHỤ KIỆN", subtitle: "Khám phá bộ sưu tập {category} được tuyển chọn của chúng tôi." },
      uk: { kicker: "ĐỘC QUYỀN ANH", heading: "Sản Phẩm Bộ Sưu Tập Anh", subtitle: "Khám phá di sản Anh Quốc, thời trang hiện đại và phụ kiện cao cấp." },
      india: { kicker: "DI SẢN ẤN ĐỘ", heading: "Sản Phẩm Bộ Sưu Tập Ấn Độ", subtitle: "Khám phá thời trang truyền thống thủ công và sự sang trọng dân tộc lấy cảm hứng từ Ấn Độ." },
    },
   },
    },
     },
};

const languageList = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو (Urdu)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "fr", label: "Français (French)" },
  { code: "es", label: "Español (Spanish)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "zh", label: "中文 (Chinese)" },
  { code: "pt", label: "Português (Portuguese)" },
  { code: "ru", label: "Русский (Russian)" },
  { code: "tr", label: "Türkçe (Turkish)" },
  { code: "it", label: "Italiano (Italian)" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "ko", label: "한국어 (Korean)" },
  { code: "fa", label: "فارسی (Persian)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "nl", label: "Nederlands (Dutch)" },
  { code: "vi", label: "Tiếng Việt (Vietnamese)" },
];

const rtlLanguages = ["ur", "ar", "fa"];
function App() {
 if (window.location.pathname === "/admin") {
  return <Admin />;
}
  const slides = [
    {
      title: "NEW SEASON FASHION SALE",
      subtitle: "Discover premium quality fashion crafted for modern style.",
      discount: "20% OFF",
      kicker: "THE NEW SEASON",
      imageUrl: "/banners/banner1.jpeg",
    },
    {
      title: "EXCLUSIVE LUXURY COLLECTION",
      subtitle: "Explore a carefully selected collection made for you.",
      discount: "30% OFF",
      kicker: "EXCLUSIVE SELECTION",
      imageUrl: "/banners/banner2.jpeg",
    },
    {
      title: "SPECIAL COLLECTION OFFER",
      subtitle: "Discover new arrivals and timeless luxury pieces.",
      discount: "50% OFF",
      kicker: "SPECIAL OFFER",
      imageUrl: "/banners/banner3.jpeg",
    },
    {
      title: "SUMMER COLLECTION",
      subtitle: "Explore elegant styles and exclusive pieces from MEER.",
      discount: "50% OFF",
      kicker: "NEW COLLECTION",
      imageUrl: "/banners/banner4.jpeg",
    },
  ];

  /* =========================================================
     FASHION PRODUCTS
     ========================================================= */

  const fashionProducts = [
    {
      id: "F W1",
      image: "/banners/fashion/F W1.jpeg",
      name: "Narcissus Women's Pull-on Pleated Wide Leg Dress Pants",
      price: "$37.20",
      description:
        "Pull-on pleated wide-leg dress pants with belt loops, wrinkle-resistant, high-waisted, suitable for office wear.",
    },
    {
      id: "F W2",
      image: "/banners/fashion/F W2.jpeg",
      name: "GRAPENT Capri Dress Pants for Women High Waisted Pleated Lightweight Straight Leg Elastic Waist Crop Trousers Work Pants",
      price: "$37.20",
      description:
        "High-waisted pleated capri dress pants with a lightweight straight-leg design, suitable for work and everyday wear.",
    },
    {
      id: "F W3",
      image: "/banners/fashion/F W3.jpeg",
      name: "GRAPENT Wide Leg Pants Woman Linen High Waisted Pull On Flowy Casual Baggy Drawstring Palazzo Trousers Pants Resort Wear",
      price: "$54.00",
      description:
        "Linen wide-leg pants with a high-waisted pull-on design, flowy baggy fit and drawstring waist, perfect for casual and resort wear.",
    },
    {
      id: "F W4",
      image: "/banners/fashion/F W4.jpeg",
      name: "DECIVI Women Linen Low Rise Wide Leg Pants Pleated Front Casual Long Trousers with Pockets",
      price: "$46.80",
      description:
        "Linen low-rise wide-leg pants with a pleated front, casual long design and practical pockets.",
    },
    {
      id: "F W5",
      image: "/banners/fashion/F W5.jpeg",
      name: "ANRABESS Women Linen Palazzo Pants Summer Boho Wide Leg Casual Lounge Pants",
      price: "$36.00",
      description:
        "Summer boho wide-leg linen palazzo pants perfect for casual wear, beach trips, travel and vacations.",
    },
    {
      id: "F W6",
      image: "/banners/fashion/F W6.jpeg",
      name: "Elegant Navy Blue Pakistani 3-Piece Dress",
      price: "$55.55",
      description:
        "Elegant navy blue Pakistani 3-piece outfit featuring a graceful flowing dupatta, wide-leg trousers and delicate gold embroidered borders. A sophisticated modest fashion look perfect for festive occasions, weddings, parties and special events.",
    },
    {
      id: "F W7",
      image: "/banners/fashion/F W7.jpeg",
      name: "Farshi Shalwar",
      price: "$60.00",
      description:
        "Farshi Shalwar featuring glamorous lace and bell design, giving it a royal look. Perfect for festivals or parties, it is a stylish statement piece.",
    },
    {
      id: "F W8",
      image: "/banners/fashion/F W8.jpeg",
      name: "Elegant Dark Green Pakistani Outfit",
      price: "$70.00",
      description:
        "Elegant dark green Pakistani outfit featuring a graceful long silhouette, delicate golden floral embroidery and a beautiful sheer embroidered dupatta. Perfect for weddings, festive occasions and parties.",
    },
    {
      id: "F W9",
      image: "/banners/fashion/F W9.jpeg",
      name: "The Ivory & Maroon Elegance 3-Piece",
      price: "$66.00",
      description:
        "Step out in timeless grace with a pristine off-white suit paired with a rich maroon lace-bordered dupatta—the ultimate blend of ethereal charm and modern minimalism.",
    },
    {
      id: "F W10",
      image: "/banners/fashion/F W10.jpeg",
      name: "Jet-Black & Chocolate-Mocha 3-Piece",
      price: "$66.00",
      description:
        "Elevate your look with rich jet-black sophistication paired with a luxurious chocolate-mocha embroidered dupatta—the ultimate blend of grace and modern elegance.",
    },
    {
      id: "F W11",
      image: "/banners/fashion/F W11.jpeg",
      name: "AO Universal Men's L/S Tee | Curve-Hem | Classic-Fit PYCA Pro",
      price: "$49.20",
      description:
        "Classic-fit men's long sleeve tee with a stylish curve-hem design, perfect for everyday casual wear.",
    },
    {
      id: "F W12",
      image: "/banners/fashion/F W12.jpeg",
      name: "Ultra Performance Men's 5 Pack Athletic Running Shorts",
      price: "$43.20",
      description:
        "Athletic running and workout shorts designed for basketball, gym and everyday training, featuring zippered pockets.",
    },
    {
      id: "F W13",
      image: "/banners/fashion/F W13.jpeg",
      name: "Nike Everyday Plus Cushion Crew Training Socks (6 Pair)",
      price: "$40.80",
      description:
        "Comfortable cushioned crew training socks designed for sports, workouts and everyday active wear.",
    },
    {
      id: "F W14",
      image: "/banners/fashion/F W14.jpeg",
      name: "BUYJYA 5Pcs Men's Compression Pants Shirt Top Long Sleeve Jacket Athletic Sets",
      price: "$45.60",
      description:
        "Men's athletic compression clothing set designed for gym workouts, training and active sports.",
    },
    {
      id: "F W15",
      image: "/banners/fashion/F W15.jpeg",
      name: "True Classic Tees | 3-Shirt Pack | Premium Fitted Men's T-Shirts",
      price: "$70.80",
      description:
        "Premium fitted men's crew neck T-shirts designed with a clean and classic everyday style.",
    },
    {
      id: "F W16",
      image: "/banners/fashion/F W16.jpeg",
      name: "Fruit of the Loom Men's Coolzone Boxer Briefs",
      price: "$37.20",
      description:
        "Moisture-wicking and breathable men's boxer briefs available in assorted colors and multipacks.",
    },
    {
      id: "F W17",
      image: "/banners/fashion/F W17.jpeg",
      name: "MAGE MALE Men's 3 Pieces Suit Elegant Solid One Button Slim Fit",
      price: "$82.80",
      description:
        "Elegant three-piece men's suit featuring a solid one-button slim-fit blazer, vest and pants, perfect for parties and special occasions.",
    },
    {
      id: "F W18",
      image: "/banners/fashion/F W18.jpeg",
      name: "Black Shalwar Kameez",
      price: "$50.00",
      description:
        "Stylish black shalwar kameez featuring a graceful traditional look, perfect for casual and special occasions.",
    },
    {
      id: "F W19",
      image: "/banners/fashion/F W19.jpeg",
      name: "Career Fair Office Outfit",
      price: "$79.88",
      description:
        "Professional office-inspired outfit perfect for career fairs, corporate events and polished workplace styling.",
    },
    {
      id: "F W20",
      image: "/banners/fashion/F W20.jpeg",
      name: "Sleek All-Black Men's Outfit",
      price: "$80.89",
      description:
        "Sleek all-black men's outfit featuring a fitted long sleeve button-up shirt, tailored black trousers, leather dress shoes and a wristwatch. Perfect for evening events, dinners and smart-casual occasions.",
    },
    {
      id: "F W21",
      image: "/banners/fashion/F W21.jpeg",
      name: "Black Shalwar Kameez",
      price: "$76.88",
      description:
        "Stylish black shalwar kameez, featuring a graceful traditional look with a soft natural outdoor setting. Perfect for a timeless and elegant style.",
    },
    {
      id: "F W22",
      image: "/banners/fashion/F W22.jpeg",
      name: "Off-White Designer Kurta Set",
      price: "$50.55",
      description:
        "Elevate your traditional wardrobe with this timeless off-white designer kurta set. Paired with classic brown leather Peshawari footwear, it is perfect for weddings, festive occasions and cultural celebrations.",
    },
  ];

  /* =========================================================
     JEWELLERY PRODUCTS
     ========================================================= */

  const jewelleryProducts = [
    {
      id: "J W1",
      image: "/banners/jewellery/J W1.jpeg",
      name: "Casio Gold Women Watches Set Brand Luxury Waterproof Quartz Watch",
      price: "$344.73",
      description:
        "Luxury gold-tone women's watch featuring a stylish quartz design with a waterproof finish, perfect for everyday and sport-inspired wear.",
    },
    {
      id: "J W2",
      image: "/banners/jewellery/J W2.jpeg",
      name: "Bulova Men's Icon High Precision Quartz Chronograph Watch",
      price: "$895.50",
      description:
        "High precision men's quartz chronograph watch with curved mineral crystal, water resistance, luminous markers and continuous sweeping second hand.",
    },
    {
      id: "J W3",
      image: "/banners/jewellery/J W3.jpeg",
      name: "Casio Gold Men's Watch Set Brand Luxury LED Digital Sport Watch",
      price: "$300.00",
      description:
        "Luxury men's digital sports watch with gold-tone styling, LED display, quartz movement and water-resistant design.",
    },
    {
      id: "J W4",
      image: "/banners/jewellery/J W4.jpeg",
      name: "Bulova Men's Icon High Precision Quartz Chronograph Watch",
      price: "$1,145.00",
      description:
        "Premium Bulova men's chronograph watch featuring high precision quartz movement, curved mineral crystal, water resistance and luminous markers.",
    },
    {
      id: "J W5",
      image: "/banners/jewellery/J W5.jpeg",
      name: "TAG Heuer Men's WAZ111A.BA0875 Formula 1 Stainless Steel Watch",
      price: "$2,016.00",
      description:
        "TAG Heuer Formula 1 stainless steel men's watch with a refined sporty design, perfect for a premium modern collection.",
    },
    {
      id: "J W6",
      image: "/banners/jewellery/J W6.jpeg",
      name: "Bulova Men's 98B230 Marine Star Chronograph Japanese Quartz Two Tone Watch",
      price: "$690.00",
      description:
        "Bulova Marine Star chronograph featuring Japanese quartz movement and an elegant two-tone stainless steel design.",
    },
    {
      id: "J W7",
      image: "/banners/jewellery/J W7.jpeg",
      name: "TAG Heuer Men's WAZ1110.BA0875 Stainless Steel Watch",
      price: "$1,579.00",
      description:
        "Elegant TAG Heuer stainless steel men's watch with a sophisticated and sporty luxury design.",
    },
    {
      id: "J W8",
      image: "/banners/jewellery/J W8.jpeg",
      name: "Cartier Pasha Automatic 41mm Steel Mens Bracelet Watch Date WSPA0022",
      price: "$13,696.00",
      description:
        "Luxury Cartier Pasha automatic men's watch featuring a 41mm steel case, bracelet design and date display.",
    },
    {
      id: "J W9",
      image: "/banners/jewellery/J W9.jpeg",
      name: "Apple Watch Series 5 40mm/44mm GPS WiFi + LTE Cellular Sport Band",
      price: "$209.79",
      description:
        "Apple Watch Series 5 with GPS, WiFi and LTE cellular connectivity, featuring a sporty band and versatile everyday design.",
    },
    {
      id: "J W10",
      image: "/banners/jewellery/J W10.jpeg",
      name: "Longines Conquest 41mm Steel Black Dial Automatic Mens Watch",
      price: "$964.14",
      description:
        "Longines Conquest automatic men's watch featuring a 41mm steel case and elegant black dial.",
    },
    {
      id: "J W11",
      image: "/banners/jewellery/J W11.jpeg",
      name: "[N MINT] LONGINES La Grande Classique Gold Dial Men's Watch From Japan",
      price: "$429.06",
      description:
        "Elegant Longines La Grande Classique men's watch featuring a refined gold dial and timeless luxury styling.",
    },
    {
      id: "J W12",
      image: "/banners/jewellery/J W12.jpeg",
      name: "1974 LONGINES FLAGSHIP 17J CAL 428 Mechanical Men's Wrist Watch",
      price: "$121.06",
      description:
        "Classic vintage Longines Flagship mechanical men's wristwatch with a traditional Swiss-made design.",
    },
    {
      id: "J W13",
      image: "/banners/jewellery/J W13.jpeg",
      name: "Executive Black Chronograph Watch & Bracelet Gift Set",
      price: "$500.00",
      description:
        "Refined black chronograph-style watch presented with coordinated beaded and woven leather bracelets. A stylish and sophisticated ready-to-gift accessory collection.",
    },
    {
      id: "J W14",
      image: "/banners/jewellery/J W14.jpeg",
      name: "Luxury Men's Jewellery Set with Dress Watch and Accessories",
      price: "$600.00",
      description:
        "Luxury men's jewellery set featuring a classic dress watch, silver-tone chain necklaces, cufflinks, hoop earrings and a modern bracelet in an executive gift box.",
    },
    {
      id: "J W15",
      image: "/banners/jewellery/J W15.jpeg",
      name: "Men's Silver Bracelet Set with Roman Numeral Details",
      price: "$500.00",
      description:
        "Stylish men's accessory set featuring five silver-tone metal bracelets with Roman numeral detailing, braided patterns, nail bangle and classic cuff designs.",
    },
    {
      id: "J W16",
      image: "/banners/jewellery/J W16.jpeg",
      name: "Elegant Bridal Crystal Necklace & Earrings Jewellery Set",
      price: "$5,000.00",
      description:
        "Elegant bridal jewellery set featuring a delicate V-shaped crystal necklace paired with matching floral leaf drop earrings and shimmering teardrop stones.",
    },
    {
      id: "J W17",
      image: "/banners/jewellery/J W17.jpeg",
      name: "Rose Gold Cherry Blossom Necklace & Earrings Set",
      price: "$500.00",
      description:
        "Charming rose gold-tone jewellery set featuring a necklace and matching stud earrings in a soft pink cherry blossom design with crystal accents.",
    },
    {
      id: "J W18",
      image: "/banners/jewellery/J W18.jpeg",
      name: "Rose Gold Cherry Blossom Luxury Jewellery Set",
      price: "$1,500.00",
      description:
        "Elegant rose gold-tone necklace and matching stud earrings styled in a soft pink cherry blossom motif with subtle crystal highlights.",
    },
    {
      id: "J W19",
      image: "/banners/jewellery/J W19.jpeg",
      name: "Luxury Sapphire Blue Crystal Jewellery Collection",
      price: "$1,000.00",
      description:
        "Luxurious jewellery set featuring deep sapphire-blue crystal stones with halo accents, matching drop earrings, a statement ring and tennis bracelet.",
    },
    {
      id: "J W20",
      image: "/banners/jewellery/J W20.jpeg",
      name: "Luxury Jewellery Collection",
      price: "$500.00",
      description:
        "Elegant luxury jewellery piece from the MEER Jewellery Collection.",
    },
  ];

  /* =========================================================
     BAGS & ACCESSORIES PRODUCTS
     ========================================================= */

  const bagsProducts = [
    /* AUTOMOBILES & MOTORCYCLE */
    {
      id: "B W1",
      image: "/banners/bags/Automobiles & Motorcycle/B W1.jpeg",
      name: "EKLEVA Car DVR 3 Cameras Lens 4.0 Inch HD Dash Camera",
      price: "$82.67",
      description:
        "HD car dash camera with three camera lenses, rear view camera and video recording features for automotive use.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W2",
      image: "/banners/bags/Automobiles & Motorcycle/B W2.jpeg",
      name: "iFlashDeal Tire Pressure Monitoring System with 4 External Sensors",
      price: "$81.47",
      description:
        "Wireless tire pressure monitoring system with solar power panel, USB charging, LED display and four external sensors.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W3",
      image: "/banners/bags/Automobiles & Motorcycle/B W3.jpeg",
      name: "Ancel AD410 Pro OBD2 Automotive Diagnostic Scan Tool",
      price: "$80.27",
      description:
        "Universal OBD2 diagnostic scanner designed to read and clear vehicle diagnostic codes and check engine information.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W4",
      image: "/banners/bags/Automobiles & Motorcycle/B W4.jpeg",
      name: "10 Inch Full Screen Rearview Mirror DashCam",
      price: "$84.90",
      description:
        "Full-screen rearview mirror dash camera with dual lenses, HD recording, touch control, reversing view and parking mode.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W5",
      image: "/banners/bags/Automobiles & Motorcycle/B W5.jpeg",
      name: "Xiao Si High Pressure Cordless Car Wash Spray Gun",
      price: "$115.08",
      description:
        "Cordless high-pressure water spray gun designed for convenient vehicle cleaning and car washing.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W6",
      image: "/banners/bags/Automobiles & Motorcycle/B W6.jpeg",
      name: "Mojo Car Cam 3 Pro 4K Car Camera",
      price: "$167.88",
      description:
        "4K front and 1080P rear car camera with WiFi connectivity and app control for vehicle recording.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W7",
      image: "/banners/bags/Automobiles & Motorcycle/B W7.jpeg",
      name: "Motorcycle Front Floating Brake Discs Rotors",
      price: "$206.66",
      description:
        "Front floating brake discs and rotors designed for selected Ducati motorcycle models.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W8",
      image: "/banners/bags/Automobiles & Motorcycle/B W8.jpeg",
      name: "Auto Scuff Plate Door Sill Plate for Renault Captur",
      price: "$37.86",
      description:
        "Automotive door sill scuff plates designed as interior accessories for Renault Captur models.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W9",
      image: "/banners/bags/Automobiles & Motorcycle/B W9.jpeg",
      name: "Orionstar Car Trunk Organizer",
      price: "$119.99",
      description:
        "Large waterproof trunk organizer with multiple pockets and adjustable straps for cars and SUVs.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W10",
      image: "/banners/bags/Automobiles & Motorcycle/B W10.jpeg",
      name: "VANMASS Universal Cell Phone Holder Car Mount",
      price: "$81.59",
      description:
        "Universal dashboard and windshield phone mount with anti-slip silicone and strong suction support.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W11",
      image: "/banners/bags/Automobiles & Motorcycle/B W11.jpeg",
      name: "CHGeek 15W Wireless Car Charger Phone Mount",
      price: "$117.59",
      description:
        "Wireless 15W Qi fast charging car mount with automatic clamping phone holder design.",
      subCategory: "Automobiles & Motorcycle",
    },
    {
      id: "B W12",
      image: "/banners/bags/Automobiles & Motorcycle/B W12.jpeg",
      name: "3PCS Set Car Seat Cushion and Seat Cover",
      price: "$118.79",
      description:
        "Three-piece breathable linen car seat cushion set with soft comfort and non-slip protection.",
      subCategory: "Automobiles & Motorcycle",
    },

    /* SPORTS & OUTDOOR */
    {
      id: "B W13",
      image: "/banners/bags/Sports & outdoor/B W13.jpeg",
      name: "Best Choice Products 10-in-1 Combo Game Table Set",
      price: "$178.99",
      description:
        "Multi-game table set featuring hockey, foosball, pool, shuffleboard and ping pong for indoor entertainment.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W14",
      image: "/banners/bags/Sports & outdoor/B W14.jpeg",
      name: "Slsy Folding Bed Cot with Mattress",
      price: "$78.57",
      description:
        "Folding camping cot with a comfortable mattress and carry bag, suitable for camping and guest use.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W15",
      image: "/banners/bags/Sports & outdoor/B W15.jpeg",
      name: "VIBESPARK Adjustable Weight Bench 4-in-1",
      price: "$165.99",
      description:
        "Foldable multi-function workout bench designed for home gym strength training and exercise.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W16",
      image: "/banners/bags/Sports & outdoor/B W16.jpeg",
      name: "FitRx SmartBell 4-in-1 Adjustable Weight Set",
      price: "$130.98",
      description:
        "Adjustable interchangeable weight set that can be configured for different home workout exercises.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W17",
      image: "/banners/bags/Sports & outdoor/B W17.jpeg",
      name: "CAP Barbell 20lb Coated Rubber Hex Dumbbell Pair",
      price: "$32.58",
      description:
        "Pair of coated rubber hex dumbbells designed for strength training and home workouts.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W18",
      image: "/banners/bags/Sports & outdoor/B W18.jpeg",
      name: "Huffy 12 Inch Rock It Kids Bike",
      price: "$64.20",
      description:
        "Kids bicycle designed for young riders with a fun grey and lime color combination.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W19",
      image: "/banners/bags/Sports & outdoor/B W19.jpeg",
      name: "Huffy 20 Inch Sea Star Kids Bike",
      price: "$88.30",
      description:
        "Colorful kids bicycle with a blue and pink design, suitable for young riders.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W20",
      image: "/banners/bags/Sports & outdoor/B W20.jpeg",
      name: "Razor Black Label E90 Electric Scooter",
      price: "$122.60",
      description:
        "Pink electric scooter with a stylish design for young riders.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W21",
      image: "/banners/bags/Sports & outdoor/B W21.jpeg",
      name: "Mr. Heater Portable Buddy 9000 BTU Propane Heater",
      price: "$95.13",
      description:
        "Portable outdoor heating equipment designed for convenient use during outdoor activities.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W22",
      image: "/banners/bags/Sports & outdoor/B W22.jpeg",
      name: "Goplus Portable Propane 3 Burner Outdoor Camp Stove",
      price: "$163.33",
      description:
        "Portable outdoor cooking stove with three burners, suitable for camping and outdoor cooking.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W23",
      image: "/banners/bags/Sports & outdoor/B W23.jpeg",
      name: "Dextrus Adult Tricycle 24 Inch 3 Wheel Bike",
      price: "$327.99",
      description:
        "Adult three-wheel tricycle with removable baskets, designed for outdoor riding, shopping and picnics.",
      subCategory: "Sports & outdoor",
    },
    {
      id: "B W24",
      image: "/banners/bags/Sports & outdoor/B W24.jpeg",
      name: "Odoland 16pcs Camping Cookware Set",
      price: "$59.99",
      description:
        "Lightweight camping cookware set including pots, pan, kettle, cups, plates and utensils for outdoor trips.",
      subCategory: "Sports & outdoor",
    },

    /* KIDS & TOY */
    {
      id: "B W25",
      image: "/banners/bags/Kids & toy/B W25.jpeg",
      name: "BabySmile Electric Portable Nasal Aspirator",
      price: "$40.80",
      description:
        "Portable baby care device designed for convenient household use.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W26",
      image: "/banners/bags/Kids & toy/B W26.jpeg",
      name: "Frida Baby Medicine Pacifier and Dispenser",
      price: "$46.80",
      description:
        "Baby medicine dispensing accessory designed for convenient and mess-free use.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W27",
      image: "/banners/bags/Kids & toy/B W27.jpeg",
      name: "BioGaia Baby Probiotic Drops",
      price: "$58.80",
      description:
        "Baby care probiotic product presented as part of the kids and baby essentials collection.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W28",
      image: "/banners/bags/Kids & toy/B W28.jpeg",
      name: "Baby Balance Bike Toys for 10-24 Months",
      price: "$40.80",
      description:
        "Four-wheel balance bike toy designed as an early riding and walking activity for toddlers.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W29",
      image: "/banners/bags/Kids & toy/B W29.jpeg",
      name: "BabySmile Electric Portable Nasal Aspirator Pro",
      price: "$40.80",
      description:
        "Portable baby care product included in the MEER kids and baby collection.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W30",
      image: "/banners/bags/Kids & toy/B W30.jpeg",
      name: "Kids Toy Smartphone with Music and Games",
      price: "$37.20",
      description:
        "Pretend-play toy smartphone with music, camera-style features, games and touchscreen activities.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W31",
      image: "/banners/bags/Kids & toy/B W31.jpeg",
      name: "Kids Adjustable Basketball Hoop",
      price: "$46.80",
      description:
        "Portable adjustable basketball hoop designed for indoor and outdoor kids' play.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W32",
      image: "/banners/bags/Kids & toy/B W32.jpeg",
      name: "Ninja Blast Rechargeable Game Activity Cube",
      price: "$46.80",
      description:
        "Rechargeable activity cube featuring multiple brain and memory games for children.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W33",
      image: "/banners/bags/Kids & toy/B W33.jpeg",
      name: "TingingYuli Mermaid Claw Machine for Kids",
      price: "$58.80",
      description:
        "Mini electronic claw machine toy with prize-dispenser gameplay for parties and children's activities.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W34",
      image: "/banners/bags/Kids & toy/B W34.jpeg",
      name: "Kids Ball Pit Play Tent and Tunnels",
      price: "$76.80",
      description:
        "Indoor and outdoor children's play set featuring a ball pit, play tent and tunnels.",
      subCategory: "Kids & toy",
    },
    {
      id: "B W35",
      image: "/banners/bags/Kids & toy/B W35.jpeg",
      name: "Baby Balance Bike Toys for Toddlers",
      price: "$40.80",
      description:
        "Toddler balance bike with four wheels, designed as a fun first riding toy.",
      subCategory: "Kids & toy",
    },

    /* COMPUTER & ACCESSORIES */
    {
      id: "B W36",
      image: "/banners/bags/Computer & Accessories/B W36.jpeg",
      name: "YINDIAO Computer Wired Keyboard E-sports Game",
      price: "$36.33",
      description:
        "Wired computer keyboard with illuminated keys designed for gaming, typing and office use.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W37",
      image: "/banners/bags/Computer & Accessories/B W37.jpeg",
      name: "YinDiao Caller Mechanical Keyboard 104 Keys",
      price: "$101.75",
      description:
        "104-key mechanical keyboard with green switches, backlighting and wired USB connectivity.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W38",
      image: "/banners/bags/Computer & Accessories/B W38.jpeg",
      name: "K68 60% Wireless Mechanical Keyboard",
      price: "$160.52",
      description:
        "Compact 68-key wireless mechanical keyboard with dual wireless modes and hot-swappable design.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W39",
      image: "/banners/bags/Computer & Accessories/B W39.jpeg",
      name: "Razer Basilisk X HyperSpeed Wireless Gaming Mouse",
      price: "$103.00",
      description:
        "Wireless gaming mouse featuring six buttons, 2.4GHz wireless connectivity and Bluetooth support.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W40",
      image: "/banners/bags/Computer & Accessories/B W40.jpeg",
      name: "16.5 Inch Monitor Desk Organizer Stand",
      price: "$45.80",
      description:
        "Monitor desk organizer stand with laptop storage and phone holder for a clean workspace.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W41",
      image: "/banners/bags/Computer & Accessories/B W41.jpeg",
      name: "Sony PULSE 3D Wireless Headset for PlayStation 5",
      price: "$116.60",
      description:
        "Wireless gaming headset designed for PlayStation 5 with a comfortable modern design.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W42",
      image: "/banners/bags/Computer & Accessories/B W42.jpeg",
      name: "Restored Apple iPhone 14 Plus 128GB Midnight",
      price: "$693.80",
      description:
        "Refurbished carrier-unlocked smartphone with 128GB storage in Midnight finish.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W43",
      image: "/banners/bags/Computer & Accessories/B W43.jpeg",
      name: "WD Black 1TB SN770 NVMe Internal Gaming SSD",
      price: "$99.80",
      description:
        "1TB PCIe Gen4 NVMe internal gaming SSD with M.2 2280 form factor and high-speed storage performance.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W44",
      image: "/banners/bags/Computer & Accessories/B W44.jpeg",
      name: "Restored Apple iPhone 14 Plus 128GB Purple",
      price: "$693.80",
      description:
        "Refurbished carrier-unlocked Apple smartphone with 128GB storage in Purple finish.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W45",
      image: "/banners/bags/Computer & Accessories/B W45.jpeg",
      name: "Restored Apple iPhone 14 Plus 128GB Red",
      price: "$693.80",
      description:
        "Refurbished carrier-unlocked Apple smartphone with 128GB storage in Red finish.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W46",
      image: "/banners/bags/Computer & Accessories/B W46.jpeg",
      name: "Restored Apple iPhone 14 Plus 512GB Blue",
      price: "$854.80",
      description:
        "Refurbished carrier-unlocked Apple smartphone with 512GB storage in Blue finish.",
      subCategory: "Computer & Accessories",
    },
    {
      id: "B W47",
      image: "/banners/bags/Computer & Accessories/B W47.jpeg",
      name: "Restored Apple iPhone 14 Plus 256GB Blue",
      price: "$753.80",
      description:
        "Refurbished carrier-unlocked Apple smartphone with 256GB storage in Blue finish.",
      subCategory: "Computer & Accessories",
    },
  ];

  /* =========================================================
     UK PRODUCTS
     ========================================================= */

  const ukProducts = [
    {
      id: "U W1",
      name: "Universal Men's Polo | Prestige | Classic-fit",
      price: "$63.60",
      image: "/banners/uk/U W1.jpeg",
      description: "Prestige classic-fit polo shirt crafted with breathable fabric for daily comfort.",
    },
    {
      id: "U W2",
      name: "FROGG TOGGS Men's Pro Lite Rain Suit, Waterproof",
      price: "$58.80",
      image: "/banners/uk/U W2.jpeg",
      description: "Waterproof, breathable, and dependable wet weather protection for outdoor gear.",
    },
    {
      id: "U W3",
      name: "MAGCOMSEN Men's Lightweight Bomber Jacket Casual Windbreaker",
      price: "$46.80",
      image: "/banners/uk/U W3.jpeg",
      description: "Casual windproof zip-up coat featuring 5 pockets and stylish modern design.",
    },
    {
      id: "U W4",
      name: "TACVASEN Men's Winter Jacket Cotton Military Hooded Coat",
      price: "$90.00",
      image: "/banners/uk/U W4.jpeg",
      description: "Fleece-lined thick work coat providing maximum warmth and rugged utility.",
    },
    {
      id: "U W5",
      name: "Little Beauty Hoodies for Men Zip Up Sherpa Lined Fleece",
      price: "$54.00",
      image: "/banners/uk/U W5.jpeg",
      description: "Heavyweight winter wool-lined zip sweatshirt for cold weather styling.",
    },
    {
      id: "U W6",
      name: "Spazeup Alex Mercer Black Mens Leather Jacket",
      price: "$136.80",
      image: "/banners/uk/U W6.jpeg",
      description: "Dragon patch Halloween gaming real leather jacket for iconic cosplays.",
    },
    {
      id: "U W7",
      name: "Bold Threadz Dusky Black Cyber Cosplay Samurai Leather Jacket",
      price: "$166.80",
      image: "/banners/uk/U W7.jpeg",
      description: "Gaming punk motorcycle genuine leather bomber coat with custom embroidery.",
    },
    {
      id: "U W8",
      name: "Leather Jacketz Men DMC 5 Dante Long Maroon Trench Coat",
      price: "$178.80",
      image: "/banners/uk/U W8.jpeg",
      description: "Gaming costume cosplay genuine maroon leather long trench coat.",
    },
    {
      id: "U W9",
      name: "TACVASEN Men's Bomber Jacket Lightweight Casual Spring Fall Coat",
      price: "$144.00",
      image: "/banners/uk/U W9.jpeg",
      description: "Lightweight windbreaker zip-up coat perfect for transitional season wear.",
    },
    {
      id: "U W10",
      name: "MAGCOMSEN Men's Navy Bomber Jacket Windbreaker",
      price: "$46.80",
      image: "/banners/uk/U W10.jpeg",
      description: "Casual utility windproof coat built with durable multi-pocket layout.",
    },
    {
      id: "U W11",
      name: "EA Emerald Apparel 76 Fallout Blue Cordura Bomber Jacket",
      price: "$54.00",
      image: "/banners/uk/U W11.jpeg",
      description: "Retro Fallout 76 blue lightweight Cordura bomber style gaming jacket.",
    },
    {
      id: "U W12",
      name: "TBMPOY Men's Lightweight Track Jacket Outdoor Golf Fashion Coat",
      price: "$46.80",
      image: "/banners/uk/U W12.jpeg",
      description: "Casual summer light track jacket designed for active golf and outdoor wear.",
    },
    {
      id: "U W13",
      name: "Adidas Men's Essentials 3-stripes Color Blocked Tricot Track Jacket Gray",
      price: "$54.66",
      image: "/banners/uk/U W13.jpeg",
      description: "Classic tricot athletic track jacket with signatures 3-stripes detailing.",
    },
    {
      id: "U W14",
      name: "Adidas Men's Short-Sleeve Trefoil Logo Graphic T-Shirt",
      price: "$45.00",
      image: "/banners/uk/U W14.jpeg",
      description: "Iconic trefoil graphic tee crafted from ultra-soft cotton fabric.",
    },
    {
      id: "U W15",
      name: "adidas Originals Men's Swift Run 22 Deconstructed Sneaker",
      price: "$68.99",
      image: "/banners/uk/U W15.jpeg",
      description: "Modern white/magic beige running sneaker built for everyday lifestyle comfort.",
    },
    {
      id: "U W16",
      name: "Adidas Men's Essentials 3-stripes Track Jacket Gray XL",
      price: "$54.66",
      image: "/banners/uk/U W16.jpeg",
      description: "Sporty grey color-blocked track jacket with full-zip front closure.",
    },
    {
      id: "U W17",
      name: "Adidas - Puffer Jacket - A570 - Grey Five",
      price: "$130.00",
      image: "/banners/uk/U W17.jpeg",
      description: "Insulated winter grey puffer coat providing lightweight thermal defense.",
    },
    {
      id: "U W18",
      name: "Men's Adidas Grey Standard Tiro 21 Track Pants",
      price: "$55.00",
      image: "/banners/uk/U W18.jpeg",
      description: "Tapered leg athletic track pants engineered for flexible motion.",
    },
    {
      id: "U W18A",
      name: "Adidas Premium Heavy Puffer Jacket Grey",
      price: "$130.00",
      image: "/banners/uk/U W18A.jpeg",
      description: "High-grade insulated street-style grey puffer coat.",
    },
    {
      id: "U W20",
      name: "Estee Lauder Perfectionist [CP+R] Wrinkle Lifting/Firming Serum",
      price: "$78.95",
      image: "/banners/uk/U W20.jpeg",
      description: "Targeted firming serum formulated to reduce fine lines and wrinkles.",
    },
    {
      id: "U W21",
      name: "Beauty Of Joseon Calming Serum 30ml",
      price: "$55.47",
      image: "/banners/uk/U W21.jpeg",
      description: "Soothing Green Tea and Panthenol formula for hydrated, peaceful skin.",
    },
    {
      id: "U W22",
      name: "KAHI Wrinkle Bounce Skin Fit Blending Essence 30ml",
      price: "$71.35",
      image: "/banners/uk/U W22.jpeg",
      description: "Korean cosmetic moisturizing essence for skin elastic bounce and glow.",
    },
    {
      id: "U W23",
      name: "Amore Pacific Time Response Skin Reserve Fluid 160ml",
      price: "$156.46",
      image: "/banners/uk/U W23.jpeg",
      description: "Nourishing luxury anti-aging fluid formulated with green tea essence.",
    },
    {
      id: "U W24",
      name: "Bio Ionic 10X Ultra Light Speed Hair Dryer",
      price: "$181.20",
      image: "/banners/uk/U W24.jpeg",
      description: "Ultra-lightweight professional hairdryer designed for rapid drying.",
    },
    {
      id: "U W25",
      name: "Prizm 5-in-1 Curling Iron Wand Set LED Display",
      price: "$47.19",
      image: "/banners/uk/U W25.jpeg",
      description: "Interchangeable tourmaline ceramic barrel set with 11 temperature settings.",
    },
    {
      id: "U W26",
      name: "Women Synthetic Wig Long Straight Ombre Silvery Grey Blue",
      price: "$72.15",
      image: "/banners/uk/U W26.jpeg",
      description: "Cosplay-ready synthetic long straight wig styled with sleek front bangs.",
    },
    {
      id: "U W27",
      name: "Sheep Placenta Active Plastic Firming Gift Box Set",
      price: "$27.59",
      image: "/banners/uk/U W27.jpeg",
      description: "Moisturizing and hydrating complete multi-piece skin care gift set.",
    },
    {
      id: "U W28",
      name: "Heated Eyeris Eye Massager with Bluetooth Music",
      price: "$36.78",
      image: "/banners/uk/U W28.jpeg",
      description: "Soothing thermal eye massager designed to relieve tension and strain.",
    },
    {
      id: "U W29",
      name: "8 Seconds Hair Mask Professional Keratin Hair Care Cream",
      price: "$42.99",
      image: "/banners/uk/U W29.jpeg",
      description: "Rapid smoothing and straightening salon-quality keratin treatment.",
    },
    {
      id: "U W30",
      name: "Calming and Soothing Moisturizers for Dry Skin",
      price: "$68.79",
      image: "/banners/uk/U W30.jpeg",
      description: "Rich moisture-locking lotion formulated for sensitive and dry skin types.",
    },
    {
      id: "U W31",
      name: "Caracilia Womens Wide Leg Palazzo Pants High Waisted Adjustable Tie Knot Flowy Trousers Casual Loose Lounge Pant with Pockets",
      price: "$38.40",
      image: "/banners/uk/U W31.jpeg",
      description: "High waisted adjustable tie knot flowy trousers casual loose lounge pant with pockets.",
    },
    {
      id: "U W32",
      name: "Caracilia Womens Wide Leg Palazzo Pants High Waisted Adjustable Tie Knot Flowy Trousers Casual Loose Lounge Pant with Pockets",
      price: "$38.40",
      image: "/banners/uk/U W32.jpeg",
      description: "High waisted adjustable tie knot flowy trousers casual loose lounge pant with pockets.",
    },
    {
      id: "U W33",
      name: "Michael Kors Women's Jet Set Item Crossbody Bag in Black with Silver hardware (Black/Silver)",
      price: "$74.40",
      image: "/banners/uk/U W33.jpeg",
      description: "Crossbody Bag in Black with Silver hardware.",
    },
    {
      id: "U W34",
      name: "Michael Kors Women's Jet Set Item Lg Crossbody, Vanilla 2019, One Size",
      price: "$81.60",
      image: "/banners/uk/U W34.jpeg",
      description: "Vanilla 2019 One Size Large Crossbody Bag.",
    },
    {
      id: "U W35",
      name: "ALDO Womens Eloyse handbag",
      price: "$40.80",
      image: "/banners/uk/U W35.jpeg",
      description: "Stylish ALDO Women's Eloyse handbag.",
    },
    {
      id: "U W36",
      name: "Belle Poque Women's High Waisted Wide Leg Pants Button Decorated Casual Stretchy Trousers with Pockets",
      price: "$48.00",
      image: "/banners/uk/U W36.jpeg",
      description: "Button decorated casual stretchy trousers with pockets.",
    },
    {
      id: "U W37",
      name: "RAINSMORE Laptop Bag for Women 15.6 Inch PU Tote Bag Business Office Work Bag Waterproof Briefcase Computer Tote Lightweight Handbag Shoulder, Black",
      price: "$38.40",
      image: "/banners/uk/U W37.jpeg",
      description: "15.6 Inch PU Tote Bag Business Office Work Bag Waterproof Briefcase Computer Tote Lightweight Handbag Shoulder.",
    },
    {
      id: "U W38",
      name: "Angerella Womens Elastic High Waisted Palazzo Pants Casual Wide Leg Long Lounge Pant Trousers with Pocket",
      price: "$38.40",
      image: "/banners/uk/U W38.jpeg",
      description: "Casual wide leg long lounge pant trousers with pocket.",
    },
    {
      id: "U W39",
      name: "Belle Poque Women Bermuda Shorts Elastic Waist Wide Leg Shorts with Pockets & Belts",
      price: "$67.20",
      image: "/banners/uk/U W39.jpeg",
      description: "Elastic waist wide leg shorts with pockets & belts.",
    },
    {
      id: "U W40",
      name: "Handbags for Women Shoulder Bags Tote Satchel Hobo 3pcs Purse Set",
      price: "$46.80",
      image: "/banners/uk/U W40.jpeg",
      description: "Shoulder bags tote satchel hobo 3pcs purse set.",
    },
    {
      id: "U W41",
      name: "Calvin Klein Becky Demi Shoulder Bag",
      price: "$105.60",
      image: "/banners/uk/U W41.jpeg",
      description: "Calvin Klein Becky Demi shoulder bag.",
    },
    {
      id: "U W42",
      name: "1 Pair Boardless Skateboard, Double Wheel Roller With Thicked Pendal And Durable PU Wheel Drift Anti-Slip Board, Suitable For Beginners",
      price: "$125.38",
      image: "/banners/uk/U W42.jpeg",
      description: "Double wheel roller with thicked pendal and durable PU wheel drift anti-slip board, suitable for beginners.",
    },
    {
      id: "U W43",
      name: "1.25 ct - Square Moissanite - Double Halo - Twisted Band - Vintage Inspired - Pave - Wedding Ring Set in 18K White Gold over Silver",
      price: "$113.00",
      image: "/banners/uk/U W43.jpeg",
      description: "Vintage inspired pave wedding ring set in 18K white gold over silver.",
    },
    {
      id: "U W44",
      name: "10-Tier Chest of Storage Drawer Dresser Shelf Tower Bedroom Fabric Organizer",
      price: "$46.19",
      image: "/banners/uk/U W44.jpeg",
      description: "Bedroom fabric organizer chest of storage drawer dresser shelf tower.",
    },
    {
      id: "U W45",
      name: "10pcs Hexagon Lights With Remote Sound Control Ligh Smart DIY Hexagon Wall Lights, Dual Control Hexagonal LED Light Wall Panels With USB-Power, Geometry Hex Lights Touch Used In Game Room Decor Party",
      price: "$35.78",
      image: "/banners/uk/U W45.jpeg",
      description: "Smart DIY hexagon wall lights, dual control hexagonal LED light wall panels with USB-Power.",
    },
    {
      id: "U W46",
      name: "Calvin Klein Becky Demi Shoulder Bag Signature",
      price: "$105.60",
      image: "/banners/uk/U W46.jpeg",
      description: "Calvin Klein Becky Demi shoulder bag.",
    },
    {
      id: "U W47",
      name: "Apple AirPods Pro (2nd Generation) Gen 2 - Excellent",
      price: "$180.59",
      image: "/banners/uk/U W47.jpeg",
      description: "Apple AirPods Pro 2nd Generation in excellent condition.",
    },
    {
      id: "U W48",
      name: "Bio Ionic 10X Ultra Light Speed Hair Dryer Pro",
      price: "$181.20",
      image: "/banners/uk/U W48.jpeg",
      description: "Ultra-lightweight professional hairdryer designed for rapid drying.",
    },
    {
      id: "U W49",
      name: "True Classic mens Classic 5 pack T-shirt",
      price: "$106.80",
      image: "/banners/uk/U W49.jpeg",
      description: "True Classic men's classic 5 pack T-shirt.",
    },
    {
      id: "U W50",
      name: "Midas 8x42 UHD Binocular",
      price: "$289.99",
      image: "/banners/uk/U W50.jpeg",
      description: "Midas 8x42 UHD Binocular for high clarity viewing.",
    },
    {
      id: "U W51",
      name: "Fujifilm Instax Mini 12 Instant Camera with Instax Mini Film & Photobox",
      price: "$75.06",
      image: "/banners/uk/U W51.jpeg",
      description: "Fujifilm Instax Mini 12 instant camera set.",
    },
    {
      id: "U W52",
      name: "REDTIGER 4K Dual Dash Camera Front and Rear Dash Cam Built-in WiFi&GPS for Cars",
      price: "$99.35",
      image: "/banners/uk/U W52.jpeg",
      description: "4K dual dash camera front and rear dash cam built-in WiFi and GPS.",
    },
    {
      id: "U W53",
      name: "1/4 Carat Diamond Solitaire Necklace In 14 Karat White Gold For Women",
      price: "$279.97",
      image: "/banners/uk/U W53.jpeg",
      description: "1/4 Carat diamond solitaire necklace in 14 karat white gold.",
    },
  ];

  /* =========================================================
     INDIA PRODUCTS
     ========================================================= */

  const indiaProducts = [
    {
      id: "I W1",
      name: "Deep Maroon Embroidered Designer Anarkali Suit",
      price: "$85.00",
      image: "/banners/India/I W1.jpeg",
      description: "Traditional deep maroon heavily embroidered Anarkali suit with elegant borders.",
    },
    {
      id: "I W2",
      name: "Traditional Kundan & Pearl Jhumka Earrings Display Set",
      price: "$45.00",
      image: "/banners/India/I W2.jpeg",
      description: "Exquisite Indian traditional oxidized and pearl jhumka earrings set.",
    },
    {
      id: "I W3",
      name: "Off-White & Gold Bridal Silk Lehenga Suit",
      price: "$120.00",
      image: "/banners/India/I W3.jpeg",
      description: "Royal off-white traditional suit paired with rich gold border dupatta.",
    },
    {
      id: "I W4",
      name: "Velvet & Gold Studded Traditional Indian Bangles Set",
      price: "$35.00",
      image: "/banners/India/I W4.jpeg",
      description: "Luxury velvet bangles accented with golden stone embellishments.",
    },
    {
      id: "I W5",
      name: "Royal Royal Kundan Bridal Choker Necklace Set",
      price: "$150.00",
      image: "/banners/India/I W5.jpeg",
      description: "Heavy handcrafted Kundan bridal necklace set with matching earrings and maang tikka.",
    },
    {
      id: "I W6",
      name: "Silver Oxidized Choker & Maang Tikka Ethnic Set",
      price: "$55.00",
      image: "/banners/India/I W6.jpeg",
      description: "Vintage silver oxidized necklace and earring collection for festive occasions.",
    },
    {
      id: "I W7",
      name: "Blush Pink Designer Georgette Anarkali Gown",
      price: "$95.00",
      image: "/banners/India/I W7.jpeg",
      description: "Graceful blush pink flowing Anarkali outfit with intricate embroidery work.",
    },
    {
      id: "I W8",
      name: "Luxury Velvet Bangle Storage Trunk Box",
      price: "$40.00",
      image: "/banners/India/I W8.jpeg",
      description: "Handcrafted wooden and velvet vanity box designed for bangle storage.",
    },
    {
      id: "I W9",
      name: "Pastel Mint Green Chanderi Silk Suit Set",
      price: "$78.00",
      image: "/banners/India/I W9.jpeg",
      description: "Refreshing mint green ethnic suit with delicate gold foil print dupatta.",
    },
    {
      id: "I W10",
      name: "Olive Green Embroidered Velvet Kurta Set",
      price: "$88.00",
      image: "/banners/India/I W10.jpeg",
      description: "Rich olive green velvet dress decorated with traditional embroidery.",
    },
    {
      id: "I W11",
      name: "Gold Plated Antique Chandbali Statement Earrings",
      price: "$38.00",
      image: "/banners/India/I W11.jpeg",
      description: "Stunning gold-tone ethnic drop chandbali earrings with pearl tassels.",
    },
    {
      id: "I W12",
      name: "Grey Hand-Printed Cotton Kurti Trousers Set",
      price: "$62.00",
      image: "/banners/India/I W12.jpeg",
      description: "Classy grey embroidered casual-wear ethnic suit with matching dupatta.",
    },
    {
      id: "I W13",
      name: "Silver Pearl Cluster Statement Jhumka Earrings",
      price: "$32.00",
      image: "/banners/India/I W13.jpeg",
      description: "Intricately detailed silver oxidized jhumkas featuring delicate pearl drops.",
    },
    {
      id: "I W14",
      name: "Kundan Pearl Choker Set with Matching Rings",
      price: "$68.00",
      image: "/banners/India/I W14.jpeg",
      description: "Elegant Kundan neckpiece paired with statement pearl rings for festive attire.",
    },
    {
      id: "I W15",
      name: "Maroon Jacquard Banarasi Silk Festive Lehenga",
      price: "$110.00",
      image: "/banners/India/I W15.jpeg",
      description: "Traditional deep red printed flare lehenga with gold zari work.",
    },
    {
      id: "I W16",
      name: "Sky Blue Chikankari Embroidered Anarkali Suit",
      price: "$82.00",
      image: "/banners/India/I W16.jpeg",
      description: "Ethereal sky blue Chikankari embroidered dress featuring a sheer dupatta.",
    },
    {
      id: "I W17",
      name: "Black Velvet Gold Zari Work Partywear Suit",
      price: "$105.00",
      image: "/banners/India/I W17.jpeg",
      description: "Sophisticated black long silhouette gown with heavy golden border work.",
    },
    {
      id: "I W18",
      name: "Dusty Blue Silk Blend Kurta & Trouser Set",
      price: "$65.00",
      image: "/banners/India/I W18.jpeg",
      description: "Modern minimalist dusty blue ethnic suit with thread embroidery detail.",
    },
    {
      id: "I W19",
      name: "Bridal Pearl & Gold Maang Tikka Jewelry Set",
      price: "$48.00",
      image: "/banners/India/I W19.jpeg",
      description: "Traditional Indian hair ornament paired with matching drop jhumkas.",
    },
    {
      id: "I W20",
      name: "Beige & Brown Threadwork Silk Suit Set",
      price: "$74.00",
      image: "/banners/India/I W20.jpeg",
      description: "Graceful beige designer tunic paired with flared wide-leg trousers.",
    },
    {
      id: "I W21",
      name: "Teal Blue Palazzo Kurta Set with Lace Border",
      price: "$68.00",
      image: "/banners/India/I W21.jpeg",
      description: "Contemporary teal blue casual and festive Indian wear two-piece set.",
    },
    {
      id: "I W22",
      name: "Deep Emerald Green Silk Flared Anarkali",
      price: "$92.00",
      image: "/banners/India/I W22.jpeg",
      description: "Dark green flowing flared kurta set with gold accents.",
    },
    {
      id: "I W23",
      name: "Crimson Red Short Kurti with White Sharara",
      price: "$70.00",
      image: "/banners/India/I W23.jpeg",
      description: "Vibrant red embroidered short kurta paired with a wide white sharara.",
    },
    {
      id: "I W24",
      name: "Handcrafted Pearl Passa & Ear Chain Jewelry",
      price: "$42.00",
      image: "/banners/India/I W24.jpeg",
      description: "Traditional side-head passa and ear chain ornament for brides.",
    },
    {
      id: "I W25",
      name: "Luxury Floral Perfume & Body Mist Trio",
      price: "$55.00",
      image: "/banners/India/I W25.jpeg",
      description: "Premium fragrance bottle set infused with sweet floral notes.",
    },
    {
      id: "I W26",
      name: "Signature Rose & Botanical Beauty Elixir",
      price: "$45.00",
      image: "/banners/India/I W26.jpeg",
      description: "Hydrating facial mist and rose essence skincare vial.",
    },
    {
      id: "I W27",
      name: "Luxury Cosmetic Serum & Lotion Collection",
      price: "$60.00",
      image: "/banners/India/I W27.jpeg",
      description: "Multi-piece botanical skincare serum and hydrating toner set.",
    },
    {
      id: "I W28",
      name: "Traditional Thread Embroidered Footwear (Juttis)",
      price: "$35.00",
      image: "/banners/India/I W28.jpeg",
      description: "Ethnic leather Punjabi juttis accented with thread work and beads.",
    },
    {
      id: "I W29",
      name: "Men's Olive Green Utility Jacket & Trousers",
      price: "$78.00",
      image: "/banners/India/I W29.jpeg",
      description: "Smart casual olive jacket outfit paired with classic white sneakers.",
    },
    {
      id: "I W30",
      name: "Luxury Gold Glass Perfume Bottle 100ml",
      price: "$85.00",
      image: "/banners/India/I W30.jpeg",
      description: "Elegant amber and gold luxury eau de parfum spray.",
    },
    {
      id: "I W31",
      name: "Blush Pink Embroidered Net Bridal Dupatta Suit",
      price: "$98.00",
      image: "/banners/India/I W31.jpeg",
      description: "Heavy net dupatta with detailed Zari border and silk kameez.",
    },
    {
      id: "I W32",
      name: "Hydrating Rose Facial Mist & Toner Spray",
      price: "$28.00",
      image: "/banners/India/I W32.jpeg",
      description: "Natural rosewater facial mist for instant hydration and glow.",
    },
    {
      id: "I W33",
      name: "Mauve Nude Glossy Nail Polish Collection",
      price: "$18.00",
      image: "/banners/India/I W33.jpeg",
      description: "Long-lasting quick-dry nude mauve nail lacquer bottle.",
    },
    {
      id: "I W34",
      name: "Maroon & Gold Dual Tone Flared Silk Suit",
      price: "$89.00",
      image: "/banners/India/I W34.jpeg",
      description: "Traditional dual-tone umbrella cut dress with gold borders.",
    },
    {
      id: "I W35",
      name: "Minimalist Dainty Gold Ring & Earring Set",
      price: "$30.00",
      image: "/banners/India/I W35.jpeg",
      description: "Delicate everyday wear gold accessories display.",
    },
    {
      id: "I W36",
      name: "Men's Black Formal Suit with Tailored Trousers",
      price: "$110.00",
      image: "/banners/India/I W36.jpeg",
      description: "Crisp black blazer paired with tailored pants for evening wear.",
    },
    {
      id: "I W37",
      name: "Chocolate Brown Silk Dupatta & Kurta Ensemble",
      price: "$76.00",
      image: "/banners/India/I W37.jpeg",
      description: "Rich chocolate brown ethnic suit with embroidered organza dupatta.",
    },
    {
      id: "I W38",
      name: "Men's White Silk Kurta with Gold Border",
      price: "$58.00",
      image: "/banners/India/I W38.jpeg",
      description: "Classic pristine white silk kurta featuring subtle gold collar detailing.",
    },
    {
      id: "I W39",
      name: "Vintage Silver Oxidized Bangle & Ring Set",
      price: "$36.00",
      image: "/banners/India/I W39.jpeg",
      description: "Boho style oxidized silver cuff bangles and chunky statement rings.",
    },
    {
      id: "I W40",
      name: "Nude Pink Nail Art & Aesthetic Accessories Kit",
      price: "$22.00",
      image: "/banners/India/I W40.jpeg",
      description: "Soft aesthetic pastel nail paint colors and press-on nail kit.",
    },
    {
      id: "I W41",
      name: "Black Patterned Casual T-shirt & Trouser Pair",
      price: "$48.00",
      image: "/banners/India/I W41.jpeg",
      description: "Modern street style monochrome black outfit setup.",
    },
    {
      id: "I W42",
      name: "Men's Charcoal Grey Smart Casual Outfit Set",
      price: "$84.00",
      image: "/banners/India/I W42.jpeg",
      description: "Sleek charcoal casual jacket and slim trousers ensemble.",
    },
    {
      id: "I W43",
      name: "Men's Leather Accessory & Watch Gift Set",
      price: "$75.00",
      image: "/banners/India/I W43.jpeg",
      description: "Premium wrist watch paired with matching cuff and leather accessories.",
    },
    {
      id: "I W44",
      name: "Soft Pink Georgette Palazzo & Dupatta Suit",
      price: "$82.00",
      image: "/banners/India/I W44.jpeg",
      description: "Ethereal pastel pink summer flared suit with gold trim.",
    },
    {
      id: "I W45",
      name: "Classic Beige Satin High Heels",
      price: "$65.00",
      image: "/banners/India/I W45.jpeg",
      description: "Elegant pointed-toe nude high heels suitable for evening parties.",
    },
    {
      id: "I W46",
      name: "Nude Matte Lip Color & Polish Duo",
      price: "$26.00",
      image: "/banners/India/I W46.jpeg",
      description: "Matching nude liquid lipstick and nail lacquer vanity set.",
    },
    {
      id: "I W47",
      name: "Dusty Rose Glossy Nail Lacquer",
      price: "$16.00",
      image: "/banners/India/I W47.jpeg",
      description: "High-shine dusty rose shade nail polish bottle.",
    },
    {
      id: "I W48",
      name: "Gold Tone Decorative Metallic Sculpture",
      price: "$40.00",
      image: "/banners/India/I W48.jpeg",
      description: "Luxury interior accent piece in polished brass finish.",
    },
    {
      id: "I W49",
      name: "Pastel Ombre Press-On Nails Set",
      price: "$20.00",
      image: "/banners/India/I W49.jpeg",
      description: "Ready-to-wear manicured nude pink press-on nails set.",
    },
    {
      id: "I W50",
      name: "Rose Gold Crystal Mesh Smartwatch Strap",
      price: "$72.00",
      image: "/banners/India/I W50.jpeg",
      description: "Jewelry-inspired rose gold strap watch decorated with crystal accents.",
    },
    {
      id: "I W51",
      name: "Classic White Leather Stiletto Heels",
      price: "$68.00",
      image: "/banners/India/I W51.jpeg",
      description: "Sleek pointed-toe pumps for sleek professional styling.",
    },
    {
      id: "I W52",
      name: "Pink Leather Wallet & Keychain Combo",
      price: "$34.00",
      image: "/banners/India/I W52.jpeg",
      description: "Compact pastel pink leather cardholder gift bundle.",
    },
    {
      id: "I W53",
      name: "Men's Black Tailored Long Coat",
      price: "$125.00",
      image: "/banners/India/I W53.jpeg",
      description: "Sophisticated black wool coat for smart formal wear.",
    },
    {
      id: "I W54",
      name: "Chocolate Brown Gel Nail Polish",
      price: "$18.00",
      image: "/banners/India/I W54.jpeg",
      description: "Rich chocolate hue long-wear nail varnish.",
    },
    {
      id: "I W55",
      name: "Long Brown Wavy Synthetic Hair Extension Wig",
      price: "$52.00",
      image: "/banners/India/I W55.jpeg",
      description: "High-quality heat resistant dark brown wavy full hair wig.",
    },
    {
      id: "I W56",
      name: "Men's White Silk Kurta Pajama Set",
      price: "$64.00",
      image: "/banners/India/I W56.jpeg",
      description: "Traditional pure white festive kurta pajama set.",
    },
    {
      id: "I W57",
      name: "Modern Tech Accessory & Tablet Desk Kit",
      price: "$85.00",
      image: "/banners/India/I W57.jpeg",
      description: "Minimalist workspace organization gadgets and tech accessories.",
    },
    {
      id: "I W58",
      name: "Matte Black Tumbler & Travel Flask Set",
      price: "$32.00",
      image: "/banners/India/I W58.jpeg",
      description: "Sleek insulated thermal water bottles in matte grey and black.",
    },
    {
      id: "I W59",
      name: "Gold Wire Frame Aesthetic Eyeglasses",
      price: "$28.00",
      image: "/banners/India/I W59.jpeg",
      description: "Stylish anti-blue light clear lens fashion glasses.",
    },
    {
      id: "I W60",
      name: "Deep Wine Red Structured Leather Handbag",
      price: "$65.00",
      image: "/banners/India/I W60.jpeg",
      description: "Luxury top-handle leather handbag with detachable shoulder strap.",
    },
    {
      id: "I W61",
      name: "Black Dial Stainless Steel Women's Wristwatch",
      price: "$90.00",
      image: "/banners/India/I W61.jpeg",
      description: "Classic round dial mesh watch in elegant black and silver finish.",
    },
    {
      id: "I W62",
      name: "Blush Pink Pointed Toe High Heel Pumps",
      price: "$58.00",
      image: "/banners/India/I W62.jpeg",
      description: "Chic blush pink suede stiletto pumps.",
    },
    {
      id: "I W63",
      name: "Men's Essential Shirt & Trouser Hanger Collection",
      price: "$95.00",
      image: "/banners/India/I W63.jpeg",
      description: "Wardrobe setup featuring tailored men's formal dress shirts.",
    },
    {
      id: "I W64",
      name: "Silver Layered Pendant Necklace & Chain Set",
      price: "$25.00",
      image: "/banners/India/I W64.jpeg",
      description: "Minimalist multi-layer silver heart pendant neckpiece.",
    },
    {
      id: "I W65",
      name: "Off-White Leather Ankle Boots Set",
      price: "$72.00",
      image: "/banners/India/I W65.jpeg",
      description: "Stylish cream-colored thick sole winter boots.",
    },
    {
      id: "I W66",
      name: "Pastel Pink Quilted Crossbody Shoulder Bag",
      price: "$48.00",
      image: "/banners/India/I W66.jpeg",
      description: "Modern quilted handbag with gold chain strap detail.",
    },
    {
      id: "I W67",
      name: "Long Brunette Natural Wave Wig",
      price: "$49.00",
      image: "/banners/India/I W67.jpeg",
      description: "Soft touch dark brunette long wavy hair wig.",
    },
    {
      id: "I W68",
      name: "Pastel Stainless Steel Hydration Bottle Trio",
      price: "$30.00",
      image: "/banners/India/I W68.jpeg",
      description: "Eco-friendly reusable pastel water flask collection.",
    },
    {
      id: "I W69",
      name: "Choker Necklace & Earrings Jewelry Display",
      price: "$70.00",
      image: "/banners/India/I W69.jpeg",
      description: "Royal pearl studded bridal jewelry set.",
    },
    {
      id: "I W70",
      name: "Peacock Blue Sharara Suit with Pink Dupatta",
      price: "$88.00",
      image: "/banners/India/I W70.jpeg",
      description: "Stunning peacock blue festive sharara set paired with contrast pink embroidered dupatta.",
    },
    ];
  /* =========================================================
   STATES
   ========================================================= */

const [currentSlide, setCurrentSlide] = useState(0);
const [showFashionProducts, setShowFashionProducts] = useState(false);
const [showJewelleryProducts, setShowJewelleryProducts] = useState(false);
const [showBagsProducts, setShowBagsProducts] = useState(false);
const [showUKProducts, setShowUKProducts] = useState(false);
const [showIndiaProducts, setShowIndiaProducts] = useState(false);
const [showDatabaseProducts, setShowDatabaseProducts] = useState(false);

const openDatabaseProducts = async () => {
  setSearchTerm("");
  setSpecialView(null);

  setShowFashionProducts(false);
  setShowJewelleryProducts(false);
  setShowBagsProducts(false);
  setShowUKProducts(false);
  setShowIndiaProducts(false);

  setSelectedBagCategory(null);
  setSelectedProduct(null);

  setShowDatabaseProducts(true);
  setDatabaseProductsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/products");

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch seller products.");
    }

    const formattedProducts = data.map((product) => ({
      id: `DB-${product._id}`,

      productId: product._id,

      sellerId: product.seller?._id || product.seller || null,

      sellerName: product.seller?.name || "",

      shopName: product.seller?.shopName || "",

      ownerType: product.ownerType || (product.seller ? "seller" : "admin"),

      name: product.name,

      price: `$${Number(product.price).toFixed(2)}`,

      image: product.image,

      description: product.description || "",

      quantity: product.quantity || 0,

      sold: product.sold || 0,

      category: product.category || "General",

      collection: product.collection || "MEER Collection",

      subCategory: product.subCategory || "",

      isDatabaseProduct: true,
    }));

    setDatabaseProducts(formattedProducts);
  } catch (error) {
    console.error("Database Products Error:", error);

    alert(error.message || "Could not load seller products.");
  } finally {
    setDatabaseProductsLoading(false);
  }
};

const [selectedBagCategory, setSelectedBagCategory] = useState(null);
const [selectedProduct, setSelectedProduct] = useState(null);
const [cart, setCart] = useState([]);
const [showCart, setShowCart] = useState(false);
const [showCheckout, setShowCheckout] = useState(false);
const [customerName, setCustomerName] = useState("");
const [customerEmail, setCustomerEmail] = useState("");
const [customerPhone, setCustomerPhone] = useState("");
const [customerAddress, setCustomerAddress] = useState("");
const [customerCity, setCustomerCity] = useState("");

// database products (seller + admin) - admin products isi se nikalte hain
const [databaseProducts, setDatabaseProducts] = useState([]);
const [databaseProductsLoading, setDatabaseProductsLoading] = useState(false);

// order success states
const [orderPlaced, setOrderPlaced] = useState(false);
const [lastOrder, setLastOrder] = useState(null);

// search state
const [searchTerm, setSearchTerm] = useState("");

// wishlist & compare states
const [wishlist, setWishlist] = useState([]);
const [compareList, setCompareList] = useState([]);
const [showWishlist, setShowWishlist] = useState(false);
const [showCompare, setShowCompare] = useState(false);

// special pages ("new" | "best" | "blogs" | null) & categories menu
const [specialView, setSpecialView] = useState(null);
const [showCategoryMenu, setShowCategoryMenu] = useState(false);

// language & currency states
const [language, setLanguage] = useState("en");
const [showLanguageMenu, setShowLanguageMenu] = useState(false);
const [selectedCurrency, setSelectedCurrency] = useState("U.S. Dollar $");
const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

// customer login/register states
const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem("meerUser") || "null")
);
const [userToken, setUserToken] = useState(
  localStorage.getItem("meerUserToken") || ""
);
const [showLoginModal, setShowLoginModal] = useState(false);
const [showAccountModal, setShowAccountModal] = useState(false);
const [showProfileMenu, setShowProfileMenu] = useState(false);
const [showCamera, setShowCamera] = useState(false);
const [cameraStream, setCameraStream] = useState(null);
const [cameraError, setCameraError] = useState("");
const [cameraReady, setCameraReady] = useState(false);
const videoRef = useRef(null);
const [showMyOrdersModal, setShowMyOrdersModal] = useState(false);
const [customerOrders, setCustomerOrders] = useState([]);
const [customerOrdersLoading, setCustomerOrdersLoading] = useState(false);
const [profileImage, setProfileImage] = useState(
  localStorage.getItem("meerProfileImage") || ""
);
const [showRegisterModal, setShowRegisterModal] = useState(false);
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginError, setLoginError] = useState("");
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
const [registerError, setRegisterError] = useState("");
const [registrationEnabled, setRegistrationEnabled] = useState(true);

// seller states
const [currentSeller, setCurrentSeller] = useState(
  JSON.parse(localStorage.getItem("meerSeller") || "null")
);
const [sellerToken, setSellerToken] = useState(
  localStorage.getItem("meerSellerToken") || ""
);
const [showSellerModal, setShowSellerModal] = useState(false);
const [showSellerDashboard, setShowSellerDashboard] = useState(false);
const [showAddProductModal, setShowAddProductModal] = useState(false);
const [showSellerProductsModal, setShowSellerProductsModal] = useState(false);
const [showSellerOrdersModal, setShowSellerOrdersModal] = useState(false);
const [sellerProducts, setSellerProducts] = useState([]);
const [sellerOrders, setSellerOrders] = useState([]);
const [sellerProductsLoading, setSellerProductsLoading] = useState(false);
const [sellerOrdersLoading, setSellerOrdersLoading] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);
const [productName, setProductName] = useState("");
const [productPrice, setProductPrice] = useState("");
const [productDescription, setProductDescription] = useState("");
const [productQuantity, setProductQuantity] = useState("");
const [productCategory, setProductCategory] = useState("");
const [productImage, setProductImage] = useState("");
const [productError, setProductError] = useState("");
const [productSaving, setProductSaving] = useState(false);
const [sellerMode, setSellerMode] = useState("register"); // "register" ya "login"
const [sellerName, setSellerName] = useState("");
const [sellerShopName, setSellerShopName] = useState("");
const [sellerEmail, setSellerEmail] = useState("");
const [sellerPhone, setSellerPhone] = useState("");
const [sellerPassword, setSellerPassword] = useState("");
const [sellerError, setSellerError] = useState("");
const [sellerSuccess, setSellerSuccess] = useState("");
const [sellerStatus, setSellerStatus] = useState("");
const [sellerStatusShop, setSellerStatusShop] = useState("");
const [sellerStatusLoading, setSellerStatusLoading] = useState(false);

// active translation object + helpers
const t = translations[language] || translations.en;
const isRTL = rtlLanguages.includes(language);

const tr = (str, vars) => {
  let out = str;
  Object.keys(vars || {}).forEach((key) => {
    out = out.replace(`{${key}}`, vars[key]);
  });
  return out;
};

/* =========================================================
   SLIDER
   ========================================================= */

const nextSlide = () => {
  setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
};

const prevSlide = () => {
  setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
};

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, 4000);

  return () => clearInterval(timer);
}, [slides.length]);

/* =========================================================
   CART
   ========================================================= */

const parsePrice = (price) => parseFloat(String(price).replace(/[$,]/g, ""));

const cartTotal = cart.reduce(
  (total, item) => total + parsePrice(item.price) * item.quantity,
  0
);

const addToCart = (product) => {
  setCart((prevCart) => {
    const existingProduct = prevCart.find((item) => item.id === product.id);

    if (existingProduct) {
      return prevCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prevCart, { ...product, quantity: 1 }];
  });
};

const buyNow = (product) => {
  addToCart(product);
  setSelectedProduct(null);
  setShowCart(false);
  setShowWishlist(false);
  setShowCompare(false);
  setShowCheckout(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handlePlaceOrder = async () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (
    !customerName.trim() ||
    !customerEmail.trim() ||
    !customerPhone.trim() ||
    !customerAddress.trim() ||
    !customerCity.trim()
  ) {
    alert("Please complete all customer details.");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
    alert("Please enter a valid email address.");
    return;
  }

  const orderPayload = {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    products: cart.map((item) => ({
      productId: item.productId || item._id || null,
      sellerId: item.sellerId || null,
      sellerName: item.sellerName || "",
      shopName: item.shopName || "",
      name: item.name,
      price: parsePrice(item.price),
      image: item.image,
      quantity: item.quantity,
    })),
    totalAmount: cartTotal,
  };

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to submit order.");
      return;
    }

    setLastOrder({
      orderId: data.order._id,
      customer: { name: customerName },
      total: cartTotal.toFixed(2),
    });
    setOrderPlaced(true);
    setCart([]);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerCity("");
  } catch (error) {
    console.log("Order submit error:", error.message);
    alert("Could not connect to the server. Please make sure the backend is running.");
  }
};

/* =========================================================
   WISHLIST & COMPARE
   ========================================================= */

const isInWishlist = (id) => wishlist.some((item) => item.id === id);
const isInCompare = (id) => compareList.some((item) => item.id === id);

const toggleWishlist = (product) => {
  setWishlist((prev) =>
    prev.some((item) => item.id === product.id)
      ? prev.filter((item) => item.id !== product.id)
      : [...prev, product]
  );
};

const toggleCompare = (product) => {
  if (!isInCompare(product.id) && compareList.length >= 3) {
    alert("You can compare up to 3 products at a time.");
    return;
  }

  setCompareList((prev) =>
    prev.some((item) => item.id === product.id)
      ? prev.filter((item) => item.id !== product.id)
      : [...prev, product]
  );
};

// category name ab language ke hisaab se aata hai
const getCategoryName = (product) => {
  if (product.isDatabaseProduct) {
    return product.category || "Seller Product";
  }

  if (product.subCategory) {
    return `${t.categoryMenu.bags} - ${product.subCategory}`;
  }

  const prefix = product.id.charAt(0);

  if (prefix === "F") return t.categoryMenu.fashion;
  if (prefix === "J") return t.categoryMenu.jewellery;
  if (prefix === "U") return t.categoryMenu.uk;
  if (prefix === "I") return t.categoryMenu.india;

  return "";
};

/* =========================================================
   SCROLL HELPER
   ========================================================= */

const scrollToId = (id) => {
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

const scrollToResults = () => scrollToId("search-results");

/* =========================================================
   CHECK IF REGISTRATION IS ON/OFF
   ========================================================= */

useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/settings");
      const data = await response.json();
      setRegistrationEnabled(data.registrationEnabled);
    } catch (error) {
      console.error("Settings fetch error:", error);
    }
  };

  fetchSettings();
}, []);

/* =========================================================
   FETCH DATABASE PRODUCTS (SELLER + ADMIN) FOR CUSTOMERS
   ========================================================= */

useEffect(() => {
  const fetchDatabaseProducts = async () => {
    setDatabaseProductsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/products");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products.");
      }

      const formatted = data.map((product) => ({
        id: `DB-${product._id}`,
        productId: product._id,

        sellerId: product.seller?._id || product.seller || null,

        sellerName: product.seller?.name || "",

        shopName: product.seller?.shopName || "",

        ownerType: product.ownerType || (product.seller ? "seller" : "admin"),

        name: product.name,

        price: `$${Number(product.price).toFixed(2)}`,

        image: product.image,

        description: product.description || "",

        quantity: product.quantity || 0,

        sold: product.sold || 0,

        category: product.category || "General",

        // IMPORTANT
        collection: product.collection || "MEER Collection",

        subCategory: product.subCategory || "",

        isDatabaseProduct: true,
      }));

      setDatabaseProducts(formatted);
    } catch (error) {
      console.error("Database Products Error:", error);
    } finally {
      setDatabaseProductsLoading(false);
    }
  };

  fetchDatabaseProducts();
}, []);

const openProfileCamera = async () => {
  setCameraError("");
  setCameraReady(false);

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported by this browser.");
      setShowCamera(true);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    setCameraStream(stream);
    setShowCamera(true);
    setShowProfileMenu(false);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current
          .play()
          .then(() => {
            setCameraReady(true);
          })
          .catch((error) => {
            console.error("Camera play error:", error);
          });
      }
    }, 300);
  } catch (error) {
    console.error("Camera Error:", error);

    setCameraError(
      "No camera was found on this device. Please check that your webcam is connected and enabled."
    );

    setShowCamera(true);
    setShowProfileMenu(false);
  }
};

useEffect(() => {
  if (!showCamera || !cameraStream) return;

  const video = videoRef.current;

  if (!video) return;

  video.srcObject = cameraStream;

  const startCamera = async () => {
    try {
      await video.play();
    } catch (error) {
      console.error("Video Play Error:", error);
    }
  };

  startCamera();

  return () => {
    video.srcObject = null;
  };
}, [showCamera, cameraStream]);

/* =========================================================
   CUSTOMER LOGIN / REGISTER / LOGOUT
   ========================================================= */

const handleCustomerLogin = async (e) => {
  e.preventDefault();
  setLoginError("");

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoginError(data.message || "Login failed.");
      return;
    }

    localStorage.setItem("meerUserToken", data.token);
    localStorage.setItem("meerUser", JSON.stringify(data.user));
    setUserToken(data.token);
    setCurrentUser(data.user);
    setShowLoginModal(false);
    setLoginEmail("");
    setLoginPassword("");
  } catch (error) {
    setLoginError("Could not connect to the server.");
  }
};

const handleCustomerRegister = async (e) => {
  e.preventDefault();
  setRegisterError("");

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setRegisterError(data.message || "Registration failed.");
      return;
    }

    localStorage.setItem("meerUserToken", data.token);
    localStorage.setItem("meerUser", JSON.stringify(data.user));
    setUserToken(data.token);
    setCurrentUser(data.user);
    setShowRegisterModal(false);
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
  } catch (error) {
    setRegisterError("Could not connect to the server.");
  }
};

const handleCustomerLogout = () => {
  localStorage.removeItem("meerUserToken");
  localStorage.removeItem("meerUser");
  setUserToken("");
  setCurrentUser(null);
};

const handleMyOrders = async () => {
  if (!userToken) {
    alert("Please login to view your orders.");
    return;
  }

  // My Orders modal immediately open
  setShowAccountModal(false);
  setShowMyOrdersModal(true);
  setCustomerOrdersLoading(true);
  setCustomerOrders([]);

  try {
    const response = await fetch("http://localhost:5000/api/my-orders", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch your orders.");
    }

    setCustomerOrders(data);
  } catch (error) {
    console.error("My Orders Error:", error);

    alert("Could not load your orders.");
  } finally {
    setCustomerOrdersLoading(false);
  }
};

/* =========================================================
   SELLER: MODAL / REGISTER / LOGIN / LOGOUT
   ========================================================= */

const openSellerModal = async (mode) => {
  setSellerMode(mode);
  setSellerError("");
  setSellerSuccess("");
  setSellerStatus("");

  const savedEmail = localStorage.getItem("meerSellerApplicationEmail");

  // Seller registration status check
  if (mode === "register" && savedEmail) {
    setSellerEmail(savedEmail);
    setSellerStatusLoading(true);
    setShowSellerModal(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/sellers/check-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: savedEmail,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSellerStatus(data.status);
        setSellerStatusShop(data.shopName || "");
      } else {
        // Agar application nahi mili to normal registration form
        setSellerStatus("");
      }
    } catch (error) {
      console.error("Seller Status Check Error:", error);
      setSellerStatus("");
    } finally {
      setSellerStatusLoading(false);
    }

    return;
  }

  setShowSellerModal(true);
};

const closeSellerModal = () => {
  setShowSellerModal(false);
  setSellerError("");
  setSellerSuccess("");
};

// Seller register (admin approval ke liye jata hai)
const handleSellerRegister = async (e) => {
  e.preventDefault();
  setSellerError("");
  setSellerSuccess("");

  try {
    const response = await fetch("http://localhost:5000/api/sellers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: sellerName,
        shopName: sellerShopName,
        email: sellerEmail,
        phone: sellerPhone,
        password: sellerPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setSellerError(data.message || "Registration failed.");
      return;
    }

    setSellerSuccess(data.message);

    localStorage.setItem(
      "meerSellerApplicationEmail",
      sellerEmail.toLowerCase()
    );

    setSellerName("");
    setSellerShopName("");
    setSellerEmail("");
    setSellerPhone("");
    setSellerPassword("");
  } catch (error) {
    setSellerError("Could not connect to the server.");
  }
};

// Seller login (sirf approved)
const handleSellerLogin = async (e) => {
  e.preventDefault();
  setSellerError("");

  try {
    const response = await fetch("http://localhost:5000/api/sellers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: sellerEmail,
        password: sellerPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setSellerError(data.message || "Login failed.");
      return;
    }

    localStorage.setItem("meerSellerToken", data.token);
    localStorage.setItem("meerSeller", JSON.stringify(data.seller));
    setSellerToken(data.token);
    setCurrentSeller(data.seller);
    setShowSellerModal(false);
    setSellerEmail("");
    setSellerPassword("");
  } catch (error) {
    setSellerError("Could not connect to the server.");
  }
};

const handleCheckSellerStatus = async () => {
  setSellerError("");
  setSellerSuccess("");
  setSellerStatus("");

  if (!sellerEmail.trim()) {
    setSellerError("Please enter the email you used for seller registration.");
    return;
  }

  setSellerStatusLoading(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/sellers/check-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sellerEmail,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setSellerError(data.message || "Could not check application status.");
      return;
    }

    setSellerStatus(data.status);
    setSellerStatusShop(data.shopName || "");
  } catch (error) {
    console.error("Seller Status Error:", error);
    setSellerError("Could not connect to the server.");
  } finally {
    setSellerStatusLoading(false);
  }
};

const handleSellerLogout = () => {
  localStorage.removeItem("meerSellerToken");
  localStorage.removeItem("meerSeller");
  setSellerToken("");
  setCurrentSeller(null);
};

const resetProductForm = () => {
  setEditingProduct(null);

  setProductName("");
  setProductPrice("");
  setProductDescription("");
  setProductQuantity("");
  setProductCategory("");
  setProductImage("");
  setProductError("");
};

const openAddProduct = () => {
  resetProductForm();

  setShowSellerDashboard(false);
  setShowSellerProductsModal(false);
  setShowAddProductModal(true);
};

const fetchSellerProducts = async () => {
  if (!sellerToken) return;

  setSellerProductsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/seller/products", {
      headers: {
        Authorization: `Bearer ${sellerToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products.");
    }

    setSellerProducts(data);
  } catch (error) {
    console.error("Fetch Seller Products Error:", error);

    alert(error.message || "Could not load your products.");
  } finally {
    setSellerProductsLoading(false);
  }
};

const openSellerProducts = async () => {
  setShowSellerDashboard(false);
  setShowSellerProductsModal(true);

  await fetchSellerProducts();
};

const openEditProduct = (product) => {
  setEditingProduct(product);

  setProductName(product.name || "");
  setProductPrice(product.price ?? "");
  setProductDescription(product.description || "");
  setProductQuantity(product.quantity ?? "");
  setProductCategory(product.category || "");
  setProductImage(product.image || "");
  setProductError("");

  setShowSellerProductsModal(false);
  setShowAddProductModal(true);
};

const handleProductImageChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setProductError("Please select a valid image.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setProductImage(reader.result);
    setProductError("");
  };

  reader.readAsDataURL(file);
};

const handleSaveProduct = async (e) => {
  e.preventDefault();

  setProductError("");

  if (!productName.trim()) {
    setProductError("Product name is required.");
    return;
  }

  if (productPrice === "" || Number(productPrice) < 0) {
    setProductError("Please enter a valid price.");
    return;
  }

  if (
    productQuantity === "" ||
    !Number.isInteger(Number(productQuantity)) ||
    Number(productQuantity) < 0
  ) {
    setProductError("Please enter a valid whole-number quantity.");
    return;
  }

  setProductSaving(true);

  try {
    const payload = {
      name: productName.trim(),
      price: Number(productPrice),
      description: productDescription.trim(),
      quantity: Number(productQuantity),
      category: productCategory.trim() || "General",
      image: productImage,
    };

    const url = editingProduct
      ? `http://localhost:5000/api/seller/products/${editingProduct._id}`
      : "http://localhost:5000/api/seller/products";

    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save product.");
    }

    alert(
      editingProduct
        ? "Product updated successfully!"
        : "Product added successfully!"
    );

    resetProductForm();

    setShowAddProductModal(false);

    await fetchSellerProducts();
  } catch (error) {
    console.error("Save Product Error:", error);

    setProductError(error.message || "Could not save product.");
  } finally {
    setProductSaving(false);
  }
};

const handleDeleteProduct = async (productId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/seller/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sellerToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete product.");
    }

    setSellerProducts((current) =>
      current.filter((product) => product._id !== productId)
    );

    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Delete Product Error:", error);

    alert(error.message || "Could not delete product.");
  }
};

const handleSellerOrders = async () => {
  if (!sellerToken) {
    alert("Please login as a seller first.");
    return;
  }

  setShowSellerDashboard(false);
  setShowSellerOrdersModal(true);
  setSellerOrdersLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/seller/orders", {
      headers: {
        Authorization: `Bearer ${sellerToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders.");
    }

    setSellerOrders(data);
  } catch (error) {
    console.error("Seller Orders Error:", error);

    alert(error.message || "Could not load seller orders.");
  } finally {
    setSellerOrdersLoading(false);
  }
};

/* =========================================================
   OPEN MAIN CATEGORIES
   ========================================================= */

const openFashion = () => {
  setSearchTerm("");
  setSpecialView(null);
  setShowFashionProducts(true);
  setShowJewelleryProducts(false);
  setShowBagsProducts(false);
  setShowUKProducts(false);
  setShowIndiaProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

const openJewellery = () => {
  setSearchTerm("");
  setSpecialView(null);
  setShowJewelleryProducts(true);
  setShowFashionProducts(false);
  setShowBagsProducts(false);
  setShowUKProducts(false);
  setShowIndiaProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

const openBags = () => {
  setSearchTerm("");
  setSpecialView(null);
  setShowBagsProducts(true);
  setShowFashionProducts(false);
  setShowJewelleryProducts(false);
  setShowUKProducts(false);
  setShowIndiaProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

const openUK = () => {
  setSearchTerm("");
  setSpecialView(null);
  setShowUKProducts(true);
  setShowFashionProducts(false);
  setShowJewelleryProducts(false);
  setShowBagsProducts(false);
  setShowIndiaProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

const openIndia = () => {
  setSearchTerm("");
  setSpecialView(null);
  setShowIndiaProducts(true);
  setShowUKProducts(false);
  setShowFashionProducts(false);
  setShowJewelleryProducts(false);
  setShowBagsProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

/* =========================================================
   OPEN SPECIAL PAGES: New Arrivals / Best Sellers / Blogs
   ========================================================= */

const openSpecial = (type) => {
  setSearchTerm("");
  setShowFashionProducts(false);
  setShowJewelleryProducts(false);
  setShowBagsProducts(false);
  setShowUKProducts(false);
  setShowIndiaProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
  setShowCategoryMenu(false);
  setSpecialView(type);
  scrollToId(type === "blogs" ? "blogs" : "search-results");
};

const goToCategory = (openFunction) => {
  openFunction();
  setShowCategoryMenu(false);
  scrollToResults();
};

const handleHeroShop = () => {
  const actions = [openFashion, openJewellery, openUK, openIndia];
  actions[currentSlide]();
  scrollToResults();
};

/* =========================================================
   OPEN BAG SUBCATEGORY
   ========================================================= */

const openBagSubCategory = (category) => {
  setSelectedBagCategory(category);
  setSelectedProduct(null);
};

/* =========================================================
   BACK TO MAIN CATEGORIES
   ========================================================= */

const backToCategories = () => {
  setSearchTerm("");
  setSpecialView(null);
  setShowFashionProducts(false);
  setShowJewelleryProducts(false);
  setShowBagsProducts(false);
  setShowUKProducts(false);
  setShowIndiaProducts(false);
  setShowDatabaseProducts(false);
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

/* =========================================================
   BACK TO BAG SUBCATEGORIES
   ========================================================= */

const backToBagCategories = () => {
  setSelectedBagCategory(null);
  setSelectedProduct(null);
};

/* =========================================================
   SEARCH
   ========================================================= */

const allProducts = [
  ...fashionProducts,
  ...jewelleryProducts,
  ...bagsProducts,
  ...ukProducts,
  ...indiaProducts,
  ...databaseProducts,
];

const isSearching = searchTerm.trim() !== "";

const searchResults = allProducts.filter((product) => {
  const text = (
    (product.name || "") +
    " " +
    (product.description || "") +
    " " +
    (product.subCategory || "") +
    " " +
    (product.category || "")
  ).toLowerCase();

  return searchTerm
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .every((word) => text.includes(word));
});

/* =========================================================
   NEW ARRIVALS / BEST SELLERS / BLOGS DATA
   ========================================================= */

const newArrivals = [
  ...fashionProducts.slice(-4),
  ...jewelleryProducts.slice(-4),
  ...bagsProducts.slice(-4),
  ...ukProducts.slice(-4),
  ...indiaProducts.slice(-4),
];

const bestSellerIds = [
  "F W6", "F W8", "F W17",
  "J W2", "J W5", "J W9",
  "B W39", "B W43",
  "U W15", "U W17", "U W41", "U W47",
  "I W1", "I W5", "I W15", "I W36",
];

const bestSellers = allProducts.filter((product) =>
  bestSellerIds.includes(product.id)
);

const blogPosts = [
  {
    id: 1,
    title: "How to Style a Kurta Set for Weddings",
    date: "September 2026",
    text: "A well-chosen kurta set can carry you through every wedding function. Pair a rich colour with subtle embroidery, add classic footwear, and keep accessories simple so the outfit stays the star.",
  },
  {
    id: 2,
    title: "Choosing Your First Luxury Watch",
    date: "September 2026",
    text: "Start with how you plan to wear it. A steel chronograph suits everyday use, while a slim dress watch works best for formal occasions. Look at movement, case size and strap comfort before you decide.",
  },
  {
    id: 3,
    title: "Winter Jacket Guide: Bomber, Puffer or Leather?",
    date: "September 2026",
    text: "Bomber jackets are light and easy for cool days, puffers give the most warmth in real cold, and leather adds a sharp finish to any outfit. Pick the one that matches your climate and daily routine.",
  },
];

const isSpecial = specialView === "new" || specialView === "best";

/* =========================================================
   ADMIN PRODUCTS vs SELLER PRODUCTS
   ========================================================= */

// Admin ke products: ownerType admin ho ya seller na ho
const adminProducts = databaseProducts.filter(
  (product) => product.ownerType === "admin" || !product.sellerId
);

// Sirf sellers ke products ("Seller Products" page ke liye)
const sellerOnlyProducts = databaseProducts.filter(
  (product) => product.ownerType !== "admin" && product.sellerId
);

const getAdminCollectionProducts = (collectionName, subCategory = null) => {
  return adminProducts.filter((product) => {
    const selectedCollection = String(collectionName || "")
      .trim()
      .toLowerCase();

    const productCollection = String(product.collection || "")
      .trim()
      .toLowerCase();

    const productCategory = String(product.category || "")
      .trim()
      .toLowerCase();

    // Product ko collection YA category dono mein check karo
    const collectionMatch =
      productCollection === selectedCollection ||
      productCategory === selectedCollection;

    if (!collectionMatch) {
      return false;
    }

    // Bags ke andar sub-category bhi check hogi
    if (subCategory) {
      const productSubCategory = String(product.subCategory || "")
        .trim()
        .toLowerCase();

      const selectedSubCategory = String(subCategory || "")
        .trim()
        .toLowerCase();

      return productSubCategory === selectedSubCategory;
    }

    return true;
  });
};

/* =========================================================
   ACTIVE PRODUCTS & CATEGORY
   ========================================================= */

const activeProducts = isSearching
  ? searchResults
  : specialView === "new"
  ? newArrivals
  : specialView === "best"
  ? bestSellers
  : showDatabaseProducts
  ? sellerOnlyProducts
  : showBagsProducts && selectedBagCategory
  ? [
      ...bagsProducts.filter(
        (product) => product.subCategory === selectedBagCategory
      ),
      ...getAdminCollectionProducts(
        "Bags & Accessories",
        selectedBagCategory
      ),
    ]
  : showBagsProducts
  ? [
      ...bagsProducts,
      ...getAdminCollectionProducts("Bags & Accessories"),
    ]
  : showUKProducts
  ? [
      ...ukProducts,
      ...getAdminCollectionProducts("UK Collection"),
    ]
  : showIndiaProducts
  ? [
      ...indiaProducts,
      ...getAdminCollectionProducts("India Collection"),
    ]
  : showJewelleryProducts
  ? [
      ...jewelleryProducts,
      ...getAdminCollectionProducts("Jewellery"),
    ]
  : [
      ...fashionProducts,
      ...getAdminCollectionProducts("Fashion"),
    ];

const activeCategory = isSearching
  ? "SEARCH RESULTS"
  : specialView === "new"
  ? "NEW ARRIVALS"
  : specialView === "best"
  ? "BEST SELLERS"
  : showDatabaseProducts
  ? "SELLER PRODUCTS"
  : showBagsProducts
  ? selectedBagCategory
    ? selectedBagCategory
    : "BAGS & ACCESSORIES"
  : showUKProducts
  ? "UK COLLECTION"
  : showIndiaProducts
  ? "INDIA COLLECTION"
  : showJewelleryProducts
  ? "JEWELLERY"
  : "FASHION";

/* =========================================================
   ORDER SUCCESS VIEW
   ========================================================= */

if (orderPlaced && lastOrder) {
  return (
    <div className="checkout-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="checkout-page-header">
        <div className="checkout-logo">
          <span>MEER</span>
          <small>LUXURY COLLECTION</small>
        </div>
      </div>

      <div className="order-success">
        <div className="order-success-icon">✓</div>
        <h1>{t.orderSuccess.thankYou}, {lastOrder.customer.name}!</h1>
        <p>{t.orderSuccess.message}</p>
        <p>
          <strong>{t.orderSuccess.orderId}</strong> {lastOrder.orderId}
        </p>
        <p>
          <strong>{t.orderSuccess.total}</strong> ${lastOrder.total}
        </p>
        <button
          type="button"
          className="place-order-button"
          onClick={() => {
            setOrderPlaced(false);
            setLastOrder(null);
            setShowCheckout(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {t.orderSuccess.continueShopping}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   CHECKOUT VIEW
   ========================================================= */

if (showCheckout) {
  return (
    <div className="checkout-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="checkout-page-header">
        <div className="checkout-logo">
          <span>MEER</span>
          <small>LUXURY COLLECTION</small>
        </div>

        <button
          type="button"
          className="checkout-back"
          onClick={() => setShowCheckout(false)}
        >
          {t.checkout.backToCart}
        </button>
      </div>

      <div className="checkout-main">
        <div className="checkout-form-section">
          <h1>{t.checkout.heading}</h1>
          <p>{t.checkout.subtitle}</p>

          <div className="checkout-form">
            <div className="checkout-field">
              <label>{t.checkout.fullName}</label>
              <input
                type="text"
                placeholder={t.checkout.placeName}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="checkout-field">
              <label>{t.checkout.email}</label>
              <input
                type="email"
                placeholder={t.checkout.placeEmail}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <div className="checkout-field">
              <label>{t.checkout.phone}</label>
              <input
                type="tel"
                placeholder={t.checkout.placePhone}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="checkout-field">
              <label>{t.checkout.address}</label>
              <textarea
                placeholder={t.checkout.placeAddress}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              ></textarea>
            </div>

            <div className="checkout-field">
              <label>{t.checkout.city}</label>
              <input
                type="text"
                placeholder={t.checkout.placeCity}
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="place-order-button"
              onClick={handlePlaceOrder}
            >
              {t.checkout.placeOrder}
            </button>
          </div>
        </div>

        <div className="checkout-order-summary">
          <h2>{t.checkout.yourOrder}</h2>

          {cart.map((item) => (
            <div className="checkout-product" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>{t.checkout.quantity}: {item.quantity}</p>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}

          <div className="checkout-total">
            <span>{t.checkout.total}</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP RENDER
   ========================================================= */

return (
  <div
    dir={isRTL ? "rtl" : "ltr"}
    className={`app ${
      showFashionProducts ||
      showJewelleryProducts ||
      showBagsProducts ||
      showUKProducts ||
      showIndiaProducts ||
      showDatabaseProducts ||
      isSearching ||
      specialView !== null
        ? "fashion-view"
        : ""
    }`}
  >
    {/* ================= ANNOUNCEMENT BAR ================= */}

    <div className="announcement-bar">
      <div className="announcement-track">
        <span>{t.announcement.line1}</span>
        <span>✦</span>
        <span>{t.announcement.line2}</span>
        <span>✦</span>
        <span>{t.announcement.line3}</span>
        <span>✦</span>
        <span>{t.announcement.line1}</span>
      </div>
    </div>

    {/* ================= TOP UTILITY BAR ================= */}

    <div className="top-bar">
      <div className="top-left">

        {/* LANGUAGE DROPDOWN */}
        <div className="top-dropdown-wrapper">
          <span
            onClick={() => {
              setShowLanguageMenu((prev) => !prev);
              setShowCurrencyMenu(false);
            }}
          >
            {languageList.find((l) => l.code === language)?.label} ▾
          </span>

          {showLanguageMenu && (
            <>
              <div
                className="top-dropdown-backdrop"
                onClick={() => setShowLanguageMenu(false)}
              ></div>

              <div className="top-dropdown-menu">
                {languageList.map((lang) => (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CURRENCY DROPDOWN */}
        <div className="top-dropdown-wrapper">
          <span
            onClick={() => {
              setShowCurrencyMenu((prev) => !prev);
              setShowLanguageMenu(false);
            }}
          >
            {selectedCurrency} ▾
          </span>

          {showCurrencyMenu && (
            <>
              <div
                className="top-dropdown-backdrop"
                onClick={() => setShowCurrencyMenu(false)}
              ></div>

              <div className="top-dropdown-menu">
                {["U.S. Dollar $", "Euro €", "British Pound £", "PKR ₨"].map(
                  (currency) => (
                    <button
                      type="button"
                      key={currency}
                      onClick={() => {
                        setSelectedCurrency(currency);
                        setShowCurrencyMenu(false);
                      }}
                    >
                      {currency}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>

      </div>

      <div className="top-right">
        <span>{t.topBar.followUs}</span>

        {/* CUSTOMER ACCOUNT */}
        {currentUser ? (
          <>
            <span
              className="customer-link"
              onClick={() => setShowAccountModal(true)}
            >
              <span className="header-profile-avatar">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  currentUser?.name?.charAt(0).toUpperCase()
                )}
              </span>

              {currentUser.name}
            </span>

            <span
              className="customer-link"
              onClick={handleCustomerLogout}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <span
              className="customer-link"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </span>

            <span
              className="customer-link"
              onClick={() => setShowRegisterModal(true)}
            >
              Registration
            </span>
          </>
        )}

        {/* SELLER */}
        {currentSeller ? (
          <>
            <span className="seller-link">
              🏪 {currentSeller.shopName}
            </span>

            <button
              type="button"
              className="seller-dashboard-button"
              onClick={() => setShowSellerDashboard(true)}
            >
              Seller Dashboard
            </button>

            <span
              className="seller-link"
              onClick={handleSellerLogout}
            >
              Seller Logout
            </span>
          </>
        ) : (
          <span
            className="seller-link"
            onClick={() => openSellerModal("register")}
          >
            Register as a Seller
          </span>
        )}
      </div>
    </div>

    {/* ================= MAIN HEADER ================= */}

    <header className="main-header">
      <div className="logo">
        <span className="logo-main">MEER</span>
        <span className="logo-sub">LUXURY COLLECTION</span>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder={t.search.placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedProduct(null);
            setSpecialView(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              scrollToResults();
            }
          }}
        />
        <button
          type="button"
          aria-label={t.search.searchLabel}
          onClick={scrollToResults}
        >
          ⌕
        </button>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-action"
          onClick={() => {
            setShowCompare(true);
            setShowWishlist(false);
            setShowCart(false);
          }}
        >
          <span className="action-icon">⇄</span>
          <span>{t.header.compare}</span>
          <b>{compareList.length}</b>
        </button>

        <button
          type="button"
          className="header-action"
          onClick={() => {
            setShowWishlist(true);
            setShowCompare(false);
            setShowCart(false);
          }}
        >
          <span className="action-icon">♡</span>
          <span>{t.header.wishlist}</span>
          <b>{wishlist.length}</b>
        </button>

        <button
          className="header-action cart-action"
          onClick={() => {
            setShowCart(true);
            setShowWishlist(false);
            setShowCompare(false);
          }}
        >
          <span className="action-icon">🛍</span>
          <span>{t.header.cart}</span>
          <b>{cart.reduce((total, item) => total + item.quantity, 0)}</b>
        </button>
      </div>
    </header>

    {/* ================= WISHLIST OVERLAY ================= */}

    {showWishlist && (
      <div className="cart-overlay" onClick={() => setShowWishlist(false)}>
        <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>{t.wishlist.title}</h2>

            <button
              type="button"
              className="cart-close"
              onClick={() => setShowWishlist(false)}
            >
              ×
            </button>
          </div>

          {wishlist.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">♡</div>
              <h3>{t.wishlist.emptyTitle}</h3>
              <p>{t.wishlist.emptyText}</p>

              <button
                type="button"
                className="continue-shopping"
                onClick={() => setShowWishlist(false)}
              >
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {wishlist.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>

                    <button
                      type="button"
                      className="wishlist-move-button"
                      onClick={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                    >
                      {t.wishlist.moveToCart}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() => toggleWishlist(item)}
                  >
                    {t.wishlist.remove}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}

    {/* ================= COMPARE OVERLAY ================= */}

    {showCompare && (
      <div className="compare-overlay" onClick={() => setShowCompare(false)}>
        <div className="compare-panel" onClick={(e) => e.stopPropagation()}>
          <div className="compare-header">
            <h2>{t.compare.title}</h2>

            <button
              type="button"
              className="cart-close"
              onClick={() => setShowCompare(false)}
            >
              ×
            </button>
          </div>

          {compareList.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">⇄</div>
              <h3>{t.compare.emptyTitle}</h3>
              <p>{t.compare.emptyText}</p>

              <button
                type="button"
                className="continue-shopping"
                onClick={() => setShowCompare(false)}
              >
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <div className="compare-scroll">
              <table className="compare-table">
                <tbody>
                  <tr>
                    <th>{t.compare.product}</th>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        <img
                          className="compare-image"
                          src={item.image}
                          alt={item.name}
                        />
                        <button
                          type="button"
                          className="compare-remove"
                          onClick={() => toggleCompare(item)}
                        >
                          {t.compare.remove}
                        </button>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>{t.compare.name}</th>
                    {compareList.map((item) => (
                      <td key={item.id}>{item.name}</td>
                    ))}
                  </tr>

                  <tr>
                    <th>{t.compare.price}</th>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        <strong>{item.price}</strong>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>{t.compare.category}</th>
                    {compareList.map((item) => (
                      <td key={item.id}>{getCategoryName(item)}</td>
                    ))}
                  </tr>

                  <tr>
                    <th>{t.compare.details}</th>
                    {compareList.map((item) => (
                      <td key={item.id}>{item.description}</td>
                    ))}
                  </tr>

                  <tr>
                    <th></th>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        <button
                          type="button"
                          className="compare-cart-button"
                          onClick={() => {
                            addToCart(item);
                            alert("Product added to cart!");
                          }}
                        >
                          {t.compare.addToCart}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )}

    {/* ================= CUSTOMER LOGIN MODAL ================= */}

    {showLoginModal && (
      <div className="cart-overlay" onClick={() => setShowLoginModal(false)}>
        <div className="auth-panel" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Login</h2>
            <button
              type="button"
              className="cart-close"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
          </div>

          <form className="auth-form" onSubmit={handleCustomerLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            {loginError && <p className="auth-error">{loginError}</p>}

            <button type="submit" className="auth-submit-button">
              Log In
            </button>

            <p className="auth-switch-text">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                  setLoginError("");
                }}
              >
                Register here
              </span>
            </p>
          </form>
        </div>
      </div>
    )}

    {/* ================= CUSTOMER REGISTER MODAL ================= */}

    {showRegisterModal && (
      <div
        className="cart-overlay"
        onClick={() => setShowRegisterModal(false)}
      >
        <div className="auth-panel" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Create Account</h2>
            <button
              type="button"
              className="cart-close"
              onClick={() => setShowRegisterModal(false)}
            >
              ×
            </button>
          </div>

          {!registrationEnabled ? (
            <div className="auth-disabled-message">
              <p>
                New registrations are currently closed. Please check back
                later.
              </p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleCustomerRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                minLength={6}
              />

              {registerError && <p className="auth-error">{registerError}</p>}

              <button type="submit" className="auth-submit-button">
                Create Account
              </button>

              <p className="auth-switch-text">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                    setRegisterError("");
                  }}
                >
                  Login here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    )}

    {/* ================= CUSTOMER ACCOUNT MODAL ================= */}

    {showAccountModal && (
      <div
        className="cart-overlay"
        onClick={() => {
          setShowAccountModal(false);
          setShowProfileMenu(false);
        }}
      >
        <div
          className="auth-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <h2>My Account</h2>

            <button
              type="button"
              className="cart-close"
              onClick={() => {
                setShowAccountModal(false);
                setShowProfileMenu(false);
              }}
            >
              ×
            </button>
          </div>

          <div className="account-content">

            {/* ================= PROFILE PHOTO ================= */}

            <div className="profile-photo-wrapper">

              <button
                type="button"
                className="account-avatar-button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <div className="account-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <span>
                      {currentUser?.name
                        ? currentUser.name.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  )}
                </div>

                <span className="profile-camera-icon">📷</span>
              </button>

              {/* ================= PROFILE MENU ================= */}

              {showProfileMenu && (
                <div className="profile-photo-menu">

                  <label className="profile-menu-item">
                    Change Photo

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        const reader = new FileReader();

                        reader.onloadend = () => {
                          const imageData = reader.result;

                          setProfileImage(imageData);

                          localStorage.setItem("meerProfileImage", imageData);

                          setShowProfileMenu(false);
                        };

                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={openProfileCamera}
                  >
                    Camera
                  </button>

                  {profileImage && (
                    <button
                      type="button"
                      className="profile-menu-item profile-remove-item"
                      onClick={() => {
                        setProfileImage("");
                        localStorage.removeItem("meerProfileImage");
                        setShowProfileMenu(false);
                      }}
                    >
                      Remove Photo
                    </button>
                  )}

                </div>
              )}

            </div>

            {/* ================= CAMERA PREVIEW ================= */}

            {showCamera && (
              <div
                className="profile-camera-box"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="profile-camera-video"
                  onLoadedMetadata={(e) => {
                    e.currentTarget
                      .play()
                      .then(() => {
                        setCameraReady(true);
                      })
                      .catch((error) => {
                        console.error("Video Play Error:", error);
                      });
                  }}
                />

                {cameraError && (
                  <p className="camera-error">{cameraError}</p>
                )}

                <div className="camera-actions">

                  <button
                    type="button"
                    className="camera-capture-button"
                    onClick={(e) => {
                      e.stopPropagation();

                      const video = videoRef.current;

                      if (
                        !video ||
                        !cameraReady ||
                        video.videoWidth === 0 ||
                        video.videoHeight === 0
                      ) {
                        setCameraError(
                          "Camera preview is not ready yet. Please wait a moment and try again."
                        );
                        return;
                      }

                      const canvas = document.createElement("canvas");

                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;

                      const context = canvas.getContext("2d");

                      if (!context) {
                        setCameraError("Could not capture photo.");
                        return;
                      }

                      context.drawImage(
                        video,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                      );

                      const imageData = canvas.toDataURL("image/jpeg", 0.9);

                      if (!imageData || imageData === "data:,") {
                        setCameraError("Photo could not be captured.");
                        return;
                      }

                      setProfileImage(imageData);

                      localStorage.setItem("meerProfileImage", imageData);

                      if (cameraStream) {
                        cameraStream
                          .getTracks()
                          .forEach((track) => track.stop());
                      }

                      setCameraStream(null);
                      setShowCamera(false);
                      setCameraError("");
                    }}
                  >
                    Take Photo
                  </button>

                  <button
                    type="button"
                    className="camera-cancel-button"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (cameraStream) {
                        cameraStream
                          .getTracks()
                          .forEach((track) => track.stop());
                      }

                      setCameraStream(null);
                      setShowCamera(false);
                      setCameraError("");
                    }}
                  >
                    Cancel
                  </button>

                </div>
              </div>
            )}

            {/* ================= CUSTOMER DETAILS ================= */}

            <h3>{currentUser?.name}</h3>

            <p className="account-email">{currentUser?.email}</p>

            <div className="account-divider"></div>

            <button
              type="button"
              className="auth-submit-button"
              onClick={handleMyOrders}
            >
              My Orders
            </button>

            <button
              type="button"
              className="account-logout-button"
              onClick={() => {
                setShowAccountModal(false);
                setShowProfileMenu(false);
                handleCustomerLogout();
              }}
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    )}

    {/* ================= CUSTOMER MY ORDERS MODAL ================= */}

    {showMyOrdersModal && (
      <div
        className="cart-overlay"
        onClick={() => setShowMyOrdersModal(false)}
      >
        <div
          className="auth-panel my-orders-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <h2>My Orders</h2>

            <button
              type="button"
              className="cart-close"
              onClick={() => setShowMyOrdersModal(false)}
            >
              ×
            </button>
          </div>

          <div className="my-orders-content">

            {customerOrdersLoading ? (
              <div className="my-orders-empty">
                <h3>Loading Orders...</h3>
                <p>Please wait while we load your orders.</p>
              </div>
            ) : customerOrders.length === 0 ? (
              <div className="my-orders-empty">
                <div className="my-orders-icon">🛍</div>
                <h3>No Orders Yet</h3>
                <p>You have not placed any orders yet.</p>
              </div>
            ) : (
              <div className="my-orders-list">

                {customerOrders.map((order) => (
                  <div className="my-order-card" key={order._id}>
                    <div className="my-order-header">
                      <div>
                        <h3>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>

                        <p>
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`my-order-status ${String(
                          order.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="my-order-products">
                      {order.products?.map((product, index) => (
                        <div
                          className="my-order-product"
                          key={`${product.name}-${index}`}
                        >
                          <img src={product.image} alt={product.name} />

                          <div className="my-order-product-info">
                            <h4>{product.name}</h4>
                            <p>Quantity: {product.quantity}</p>
                          </div>

                          <strong>
                            ${Number(product.price).toFixed(2)}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="my-order-total">
                      <span>Total Amount</span>
                      <strong>
                        ${Number(order.totalAmount).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ================= SELLER DASHBOARD ================= */}

    {showSellerDashboard && currentSeller && (
      <div
        className="cart-overlay"
        onClick={() => setShowSellerDashboard(false)}
      >
        <div
          className="seller-dashboard-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <div>
              <h2>Seller Dashboard</h2>
              <p className="seller-dashboard-shop">
                {currentSeller.shopName}
              </p>
            </div>

            <button
              type="button"
              className="cart-close"
              onClick={() => setShowSellerDashboard(false)}
            >
              ×
            </button>
          </div>

          <div className="seller-dashboard-content">

            <div className="seller-welcome">
              <span>WELCOME TO MEER</span>
              <h3>{currentSeller.name}</h3>
              <p>
                Manage your shop and products from your seller dashboard.
              </p>
            </div>

            <div className="seller-dashboard-stats">
              <div className="seller-stat-card">
                <span>Products</span>
                <strong>{sellerProducts.length}</strong>
              </div>

              <div className="seller-stat-card">
                <span>Orders</span>
                <strong>{sellerOrders.length}</strong>
              </div>

              <div className="seller-stat-card">
                <span>Units Sold</span>

                <strong>
                  {sellerProducts.reduce(
                    (total, product) =>
                      total + Number(product.sold || 0),
                    0
                  )}
                </strong>
              </div>

              <div className="seller-stat-card">
                <span>Shop Status</span>
                <strong>Approved</strong>
              </div>
            </div>

            <div className="seller-dashboard-actions">
              <button
                type="button"
                className="seller-dashboard-main-button"
                onClick={openAddProduct}
              >
                + Add Product
              </button>

              <button
                type="button"
                className="seller-dashboard-secondary-button"
                onClick={openSellerProducts}
              >
                My Products
              </button>

              <button
                type="button"
                className="seller-dashboard-secondary-button"
                onClick={handleSellerOrders}
              >
                My Orders
              </button>
            </div>

          </div>
        </div>
      </div>
    )}

    {/* ================= SELLER ADD PRODUCT ================= */}

    {showAddProductModal && (
      <div
        className="cart-overlay"
        onClick={() => {
          setShowAddProductModal(false);
          resetProductForm();
        }}
      >
        <div
          className="seller-product-form-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <div>
              <h2>
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>

              <p className="seller-dashboard-shop">
                {currentSeller?.shopName}
              </p>
            </div>

            <button
              type="button"
              className="cart-close"
              onClick={() => {
                setShowAddProductModal(false);
                resetProductForm();
              }}
            >
              ×
            </button>
          </div>

          <form
            className="seller-product-form"
            onSubmit={handleSaveProduct}
          >
            <div className="product-form-image-area">
              {productImage ? (
                <img src={productImage} alt="Product Preview" />
              ) : (
                <div className="product-image-placeholder">
                  Product Image
                </div>
              )}

              <label className="product-image-upload">
                Choose Product Image

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProductImageChange}
                />
              </label>
            </div>

            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <div className="product-form-row">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />

              <input
                type="number"
                min="0"
                step="1"
                placeholder="Remaining Quantity"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                required
              />
            </div>

            <input
              type="text"
              placeholder="Category"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            />

            <textarea
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows="4"
            />

            {productError && (
              <p className="auth-error">{productError}</p>
            )}

            <button
              type="submit"
              className="seller-product-save-button"
              disabled={productSaving}
            >
              {productSaving
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    )}

    {/* ================= SELLER MY PRODUCTS ================= */}

    {showSellerProductsModal && (
      <div
        className="cart-overlay"
        onClick={() => setShowSellerProductsModal(false)}
      >
        <div
          className="seller-products-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <div>
              <h2>My Products</h2>

              <p className="seller-dashboard-shop">
                {currentSeller?.shopName}
              </p>
            </div>

            <button
              type="button"
              className="cart-close"
              onClick={() => setShowSellerProductsModal(false)}
            >
              ×
            </button>
          </div>

          <div className="seller-products-content">
            {sellerProductsLoading ? (
              <div className="my-orders-empty">
                <h3>Loading Products...</h3>
              </div>
            ) : sellerProducts.length === 0 ? (
              <div className="my-orders-empty">
                <h3>No Products Yet</h3>

                <button
                  type="button"
                  className="seller-product-save-button"
                  onClick={openAddProduct}
                >
                  + Add Product
                </button>
              </div>
            ) : (
              <div className="seller-products-grid">
                {sellerProducts.map((product) => (
                  <div
                    className="seller-product-card"
                    key={product._id}
                  >
                    <div className="seller-product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="product-image-placeholder">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="seller-product-info">
                      <span>{product.category || "General"}</span>

                      <h3>{product.name}</h3>

                      <strong>
                        ${Number(product.price).toFixed(2)}
                      </strong>

                      <p>{product.description || "No description."}</p>
                    </div>

                    <div className="seller-inventory">
                      <div>
                        <span>Total</span>

                        <strong>
                          {Number(product.quantity || 0) +
                            Number(product.sold || 0)}
                        </strong>
                      </div>

                      <div>
                        <span>Sold</span>

                        <strong>{Number(product.sold || 0)}</strong>
                      </div>

                      <div>
                        <span>Remaining</span>

                        <strong>{Number(product.quantity || 0)}</strong>
                      </div>
                    </div>

                    <div className="seller-product-actions">
                      <button
                        type="button"
                        onClick={() => openEditProduct(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ================= SELLER MY ORDERS ================= */}

    {showSellerOrdersModal && currentSeller && (
      <div
        className="cart-overlay"
        onClick={() => setShowSellerOrdersModal(false)}
      >
        <div
          className="seller-orders-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <div>
              <h2>My Orders</h2>

              <p className="seller-dashboard-shop">
                {currentSeller.shopName}
              </p>
            </div>

            <button
              type="button"
              className="cart-close"
              onClick={() => setShowSellerOrdersModal(false)}
            >
              ×
            </button>
          </div>

          <div className="seller-orders-content">
            {sellerOrdersLoading ? (
              <div className="my-orders-empty">
                <h3>Loading Orders...</h3>
              </div>
            ) : sellerOrders.length === 0 ? (
              <div className="my-orders-empty">
                <div className="my-orders-icon">🛍</div>

                <h3>No Orders Yet</h3>

                <p>Orders for your products will appear here.</p>
              </div>
            ) : (
              <div className="seller-orders-list">
                {sellerOrders.map((order) => (
                  <div className="seller-order-card" key={order._id}>
                    <div className="seller-order-header">
                      <div>
                        <span className="seller-order-label">ORDER</span>

                        <h3>
                          #{order._id.slice(-6).toUpperCase()}
                        </h3>

                        <p>
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`seller-order-status ${String(
                          order.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="seller-customer-section">
                      <div>
                        <span>Customer</span>
                        <strong>{order.customerName}</strong>
                      </div>

                      <div>
                        <span>Email</span>
                        <strong>{order.customerEmail}</strong>
                      </div>

                      <div>
                        <span>Phone</span>
                        <strong>{order.customerPhone}</strong>
                      </div>

                      <div>
                        <span>City</span>
                        <strong>{order.customerCity}</strong>
                      </div>

                      <div className="seller-customer-address">
                        <span>Delivery Address</span>
                        <strong>{order.customerAddress}</strong>
                      </div>
                    </div>

                    <div className="seller-order-products">
                      <div className="seller-products-title">
                        Your Products
                      </div>

                      {order.products?.map((product, index) => (
                        <div
                          className="seller-order-product"
                          key={`${product.productId || product.name}-${index}`}
                        >
                          <img src={product.image} alt={product.name} />

                          <div className="seller-order-product-info">
                            <h4>{product.name}</h4>

                            <p>Quantity: {product.quantity}</p>

                            <span>
                              ${Number(product.price).toFixed(2)} each
                            </span>
                          </div>

                          <strong>
                            $
                            {(
                              Number(product.price) *
                              Number(product.quantity)
                            ).toFixed(2)}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="seller-order-footer">
                      <span>Seller Total</span>

                      <strong>
                        ${Number(order.sellerTotal || 0).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ================= SELLER MODAL ================= */}

    {showSellerModal && (
      <div className="cart-overlay" onClick={closeSellerModal}>
        <div
          className="auth-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-header">
            <h2>
              {sellerMode === "register"
                ? "Become a Seller"
                : "Seller Login"}
            </h2>

            <button
              type="button"
              className="cart-close"
              onClick={closeSellerModal}
            >
              ×
            </button>
          </div>

          {sellerMode === "register" ? (

            sellerSuccess ? (

              <div className="auth-success-message">
                <div className="auth-success-icon">✓</div>

                <h3>Application Submitted</h3>

                <p>{sellerSuccess}</p>

                <button
                  type="button"
                  className="auth-submit-button"
                  onClick={closeSellerModal}
                >
                  OK
                </button>
              </div>

            ) : sellerStatus ? (

              <div className="auth-success-message">

                <div className="auth-success-icon">
                  {sellerStatus === "approved"
                    ? "✓"
                    : sellerStatus === "rejected"
                    ? "!"
                    : "…"}
                </div>

                <h3>
                  {sellerStatus === "approved"
                    ? "Application Approved"
                    : sellerStatus === "rejected"
                    ? "Application Rejected"
                    : "Application Pending"}
                </h3>

                <p>
                  {sellerStatus === "approved"
                    ? `Your seller application for ${sellerStatusShop} has been approved.`
                    : sellerStatus === "rejected"
                    ? `Your seller application for ${sellerStatusShop} was rejected.`
                    : `Your seller application for ${sellerStatusShop} is still pending admin approval.`}
                </p>

                {sellerStatus === "approved" ? (
                  <button
                    type="button"
                    className="auth-submit-button"
                    onClick={() => openSellerModal("login")}
                  >
                    Seller Login
                  </button>
                ) : (
                  <button
                    type="button"
                    className="auth-submit-button"
                    onClick={closeSellerModal}
                  >
                    Close
                  </button>
                )}

              </div>

            ) : (

              <form
                className="auth-form"
                onSubmit={handleSellerRegister}
              >
                <p className="auth-info-text">
                  Apply to sell your products on MEER. Your application
                  will be reviewed by our admin team.
                </p>

                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="Shop / Business Name"
                  value={sellerShopName}
                  onChange={(e) => setSellerShopName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={sellerPassword}
                  onChange={(e) => setSellerPassword(e.target.value)}
                  required
                  minLength={6}
                />

                {sellerError && (
                  <p className="auth-error">{sellerError}</p>
                )}

                <button
                  type="submit"
                  className="auth-submit-button"
                >
                  Submit Application
                </button>

                <button
                  type="button"
                  className="seller-status-button"
                  onClick={handleCheckSellerStatus}
                  disabled={sellerStatusLoading}
                >
                  {sellerStatusLoading
                    ? "Checking..."
                    : "Check Application Status"}
                </button>

                <p className="auth-switch-text">
                  Already a seller?{" "}
                  <span onClick={() => openSellerModal("login")}>
                    Login here
                  </span>
                </p>
              </form>

            )

          ) : (

            <form
              className="auth-form"
              onSubmit={handleSellerLogin}
            >
              <input
                type="email"
                placeholder="Seller Email"
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={sellerPassword}
                onChange={(e) => setSellerPassword(e.target.value)}
                required
              />

              {sellerError && (
                <p className="auth-error">{sellerError}</p>
              )}

              <button
                type="submit"
                className="auth-submit-button"
              >
                Seller Log In
              </button>

              <p className="auth-switch-text">
                Want to sell on MEER?{" "}
                <span onClick={() => openSellerModal("register")}>
                  Apply here
                </span>
              </p>
            </form>

          )}
        </div>
      </div>
    )}

    {/* ================= CART OVERLAY ================= */}

    {showCart && (
      <div className="cart-overlay" onClick={() => setShowCart(false)}>
        <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>{t.cart.title}</h2>

            <button className="cart-close" onClick={() => setShowCart(false)}>
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛍</div>
              <h3>{t.cart.emptyTitle}</h3>
              <p>{t.cart.emptyText}</p>

              <button
                className="continue-shopping"
                onClick={() => setShowCart(false)}
              >
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{item.price}</p>

                      <div className="cart-quantity">
                        <button
                          onClick={() => {
                            setCart((prevCart) =>
                              prevCart.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      quantity: Math.max(
                                        1,
                                        cartItem.quantity - 1
                                      ),
                                    }
                                  : cartItem
                              )
                            );
                          }}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => {
                            setCart((prevCart) =>
                              prevCart.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      quantity: cartItem.quantity + 1,
                                    }
                                  : cartItem
                              )
                            );
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove-cart-item"
                      onClick={() => {
                        setCart((prevCart) =>
                          prevCart.filter(
                            (cartItem) => cartItem.id !== item.id
                          )
                        );
                      }}
                    >
                      {t.cart.remove}
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>{t.cart.total}</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() => {
                    setShowCheckout(true);
                    setShowCart(false);
                  }}
                >
                  {t.cart.proceedCheckout}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* ================= NAVIGATION ================= */}

    <nav className="navigation">
      <div className="categories-wrapper">
        <button
          type="button"
          className="categories-button"
          onClick={() => setShowCategoryMenu((prev) => !prev)}
        >
          ☰
          <span>{t.nav.categories}</span>
          <small>⌄</small>
        </button>

        {showCategoryMenu && (
          <>
            <div
              className="category-menu-backdrop"
              onClick={() => setShowCategoryMenu(false)}
            ></div>

            <div className="category-menu">
              <button type="button" onClick={() => goToCategory(openFashion)}>
                {t.categoryMenu.fashion}
              </button>

              <button
                type="button"
                onClick={() => goToCategory(openJewellery)}
              >
                {t.categoryMenu.jewellery}
              </button>

              <button type="button" onClick={() => goToCategory(openBags)}>
                {t.categoryMenu.bags}
              </button>

              <button type="button" onClick={() => goToCategory(openUK)}>
                {t.categoryMenu.uk}
              </button>

              <button type="button" onClick={() => goToCategory(openIndia)}>
                {t.categoryMenu.india}
              </button>

              <button
                type="button"
                onClick={() => goToCategory(openDatabaseProducts)}
              >
                Seller Products
              </button>
            </div>
          </>
        )}
      </div>

      <div className="nav-links">
        <a href="#home" onClick={backToCategories}>
          {t.nav.home}
        </a>

        <a
          href="#new-arrivals"
          onClick={(e) => {
            e.preventDefault();
            openSpecial("new");
          }}
        >
          {t.nav.newArrivals}
        </a>

        <a href="#india" onClick={openIndia}>
          {t.nav.indiaCollection}
        </a>

        <a href="#uk" onClick={openUK}>
          {t.nav.ukCollection}
        </a>

        <a
          href="#seller-products"
          onClick={(e) => {
            e.preventDefault();
            openDatabaseProducts();
            scrollToResults();
          }}
        >
          Seller Products
        </a>

        <a href="#categories" onClick={backToCategories}>
          {t.nav.allCategories}
        </a>

        <a
          href="#best-sellers"
          onClick={(e) => {
            e.preventDefault();
            openSpecial("best");
          }}
        >
          {t.nav.bestSellers}
        </a>

        <a
          href="#blogs"
          onClick={(e) => {
            e.preventDefault();
            openSpecial("blogs");
          }}
        >
          {t.nav.blogs}
        </a>
      </div>
    </nav>

    {/* ================= HERO / BANNER ================= */}

    <section className="hero-section" id="home">
      <div className="hero-slider">
        <img
          key={slides[currentSlide].imageUrl}
          src={slides[currentSlide].imageUrl}
          alt={slides[currentSlide].title}
          className="hero-slide-image"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-kicker">
            <span></span>
            {slides[currentSlide].kicker}
          </div>

          <h1>{slides[currentSlide].title}</h1>
          <p>{slides[currentSlide].subtitle}</p>

          <div className="hero-discount">{slides[currentSlide].discount}</div>

          <button
            type="button"
            className="shop-button"
            onClick={handleHeroShop}
          >
            {t.hero.shopNow}
            <span>→</span>
          </button>
        </div>

        <button
          className="slider-arrow prev-arrow"
          onClick={prevSlide}
          aria-label="Previous banner"
        >
          ❮
        </button>

        <button
          className="slider-arrow next-arrow"
          onClick={nextSlide}
          aria-label="Next banner"
        >
          ❯
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active-dot" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* ================= TODAY'S DEAL ================= */}

      <aside className="todays-deal">
        <div className="deal-heading">
          <span>🔥</span>

          <div>
            <h2>{t.deal.title}</h2>
            <p>{t.deal.subtitle}</p>
          </div>
        </div>

        <div className="deal-product">
          <div className="deal-image">
            <img src="/banners/banner2.jpeg" alt="Today's Deal" />
          </div>

          <div className="deal-info">
            <span className="deal-label">{t.deal.specialOffer}</span>
            <h3>Luxury Collection</h3>

            <div className="stars">★★★★★</div>

            <div className="price">
              <strong>$49.00</strong>
              <del>$79.00</del>
            </div>

            <button
              type="button"
              onClick={() => {
                openJewellery();
                scrollToResults();
              }}
            >
              {t.deal.viewDeal}
            </button>
          </div>
        </div>

        <div className="deal-product second-deal">
          <div className="deal-image">
            <img src="/banners/banner3.jpeg" alt="Featured Deal" />
          </div>

          <div className="deal-info">
            <span className="deal-label">{t.deal.newArrival}</span>
            <h3>Premium Selection</h3>

            <div className="stars">★★★★★</div>

            <div className="price">
              <strong>$59.00</strong>
              <del>$89.00</del>
            </div>

            <button
              type="button"
              onClick={() => {
                openFashion();
                scrollToResults();
              }}
            >
              {t.deal.viewDeal}
            </button>
          </div>
        </div>
      </aside>
    </section>

    {/* ================= COLLECTION STRIP ================= */}

    <section className="collection-strip">
      <div className="collection-item">
        <div className="collection-icon">✦</div>

        <div>
          <strong>{t.collectionStrip.indiaTitle}</strong>
          <span>{t.collectionStrip.indiaDesc}</span>
        </div>
      </div>

      <div className="collection-item">
        <div className="collection-icon">✧</div>

        <div>
          <strong>{t.collectionStrip.ukTitle}</strong>
          <span>{t.collectionStrip.ukDesc}</span>
        </div>
      </div>

      <div className="collection-item">
        <div className="collection-icon">◇</div>

        <div>
          <strong>{t.collectionStrip.qualityTitle}</strong>
          <span>{t.collectionStrip.qualityDesc}</span>
        </div>
      </div>

      <div className="collection-item">
        <div className="collection-icon">✓</div>

        <div>
          <strong>{t.collectionStrip.secureTitle}</strong>
          <span>{t.collectionStrip.secureDesc}</span>
        </div>
      </div>
    </section>

    {/* =========================================================
       BLOGS / CATEGORY CARDS / SUBCATEGORIES / PRODUCTS
       ========================================================= */}

    {specialView === "blogs" ? (
      <section className="blogs-section" id="blogs">
        <div className="section-heading">
          <span>{t.blogs.kicker}</span>

          <h2>{t.blogs.heading}</h2>

          <p>{t.blogs.subtitle}</p>

          <button
            type="button"
            className="back-to-categories"
            onClick={backToCategories}
          >
            {t.back.allCategories}
          </button>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.id}>
              <span className="blog-date">{post.date}</span>
              <h3>{post.title}</h3>
              <p>{post.text}</p>
            </article>
          ))}
        </div>
      </section>
    ) : !isSearching &&
      !isSpecial &&
      !showFashionProducts &&
      !showJewelleryProducts &&
      !showBagsProducts &&
      !showUKProducts &&
      !showIndiaProducts &&
      !showDatabaseProducts ? (
      <section className="categories-section" id="categories">
        <div className="section-heading">
          <span>{t.categoriesSection.kicker}</span>

          <h2>{t.categoriesSection.heading}</h2>

          <p>{t.categoriesSection.subtitle}</p>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-image">
              <img src="/banners/fashion.jpeg" alt="Fashion Collection" />
            </div>

            <div className="category-info">
              <h3>{t.categoryMenu.fashion}</h3>
              <p>Elegant fashion for every occasion</p>

              <button className="explore-button" onClick={openFashion}>
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img src="/banners/jewellary.jpeg" alt="Jewellery Collection" />
            </div>

            <div className="category-info">
              <h3>{t.categoryMenu.jewellery}</h3>
              <p>Beautiful pieces with timeless appeal</p>

              <button className="explore-button" onClick={openJewellery}>
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img src="/banners/bags.jpeg" alt="Bags and Accessories" />
            </div>

            <div className="category-info">
              <h3>{t.categoryMenu.bags}</h3>
              <p>Complete your look with MEER</p>

              <button className="explore-button" onClick={openBags}>
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>
        </div>

        <div className="luxury-collections">
          <div className="luxury-collection-card india-card">
            <img src="/banners/banner5.jpeg" alt="India Collection" />

            <div className="luxury-overlay">
              <span>{t.luxury.indiaKicker}</span>
              <h3>{t.luxury.indiaHeading}</h3>
              <p>{t.luxury.indiaDesc}</p>

              <button className="luxury-explore-button" onClick={openIndia}>
                {t.luxury.explore}
              </button>
            </div>
          </div>

          <div className="luxury-collection-card uk-card">
            <img src="/banners/banner6.jpeg" alt="UK Collection" />

            <div className="luxury-overlay">
              <span>{t.luxury.ukKicker}</span>
              <h3>{t.luxury.ukHeading}</h3>
              <p>{t.luxury.ukDesc}</p>

              <button className="luxury-explore-button" onClick={openUK}>
                {t.luxury.explore}
              </button>
            </div>
          </div>
        </div>
      </section>
    ) : !isSearching &&
      !isSpecial &&
      showBagsProducts &&
      !selectedBagCategory ? (
      <section className="categories-section" id="search-results">
        <div className="section-heading">
          <span>{t.bagsSection.kicker}</span>

          <h2>{t.bagsSection.heading}</h2>

          <p>{t.bagsSection.subtitle}</p>

          <button className="back-to-categories" onClick={backToCategories}>
            {t.back.categories}
          </button>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-image">
              <img
                src="/banners/bags/Automobiles & Motorcycle/B W1.jpeg"
                alt="Automobiles and Motorcycle"
              />
            </div>

            <div className="category-info">
              <h3>Automobiles & Motorcycle</h3>
              <p>Automotive products and motorcycle accessories</p>

              <button
                className="explore-button"
                onClick={() => openBagSubCategory("Automobiles & Motorcycle")}
              >
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img
                src="/banners/bags/Sports & outdoor/B W13.jpeg"
                alt="Sports and Outdoor"
              />
            </div>

            <div className="category-info">
              <h3>Sports & Outdoor</h3>
              <p>Sports, fitness and outdoor essentials</p>

              <button
                className="explore-button"
                onClick={() => openBagSubCategory("Sports & outdoor")}
              >
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img
                src="/banners/bags/Kids & toy/B W25.jpeg"
                alt="Kids and Toy"
              />
            </div>

            <div className="category-info">
              <h3>Kids & Toy</h3>
              <p>Fun products and essentials for kids</p>

              <button
                className="explore-button"
                onClick={() => openBagSubCategory("Kids & toy")}
              >
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img
                src="/banners/bags/Computer & Accessories/B W36.jpeg"
                alt="Computer and Accessories"
              />
            </div>

            <div className="category-info">
              <h3>Computer & Accessories</h3>
              <p>Computers, gaming and technology accessories</p>

              <button
                className="explore-button"
                onClick={() => openBagSubCategory("Computer & Accessories")}
              >
                {t.categoriesSection.explore}
              </button>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <section className="fashion-products-section" id="search-results">
        {selectedProduct ? (
          <div className="product-detail-view">
            <button
              className="back-to-products"
              onClick={() => setSelectedProduct(null)}
            >
              {t.back.allCategories}
            </button>

            <div className="product-detail-content">
              <div className="product-detail-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>

              <div className="product-detail-info">
                <span className="product-category">
                  {selectedProduct.subCategory ||
                    getCategoryName(selectedProduct)}
                </span>

                <h1>{selectedProduct.name}</h1>

                <div className="product-detail-price">
                  {selectedProduct.price}
                  <span> {t.productDetail.perPiece}</span>
                </div>

                <p>{selectedProduct.description}</p>

                <button
                  type="button"
                  className="shop-product-button"
                  onClick={() => buyNow(selectedProduct)}
                >
                  {t.productDetail.shopNow}
                </button>

                <div className="detail-extra-actions">
                  <button
                    type="button"
                    className={`detail-action-button ${
                      isInWishlist(selectedProduct.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(selectedProduct)}
                  >
                    {isInWishlist(selectedProduct.id)
                      ? t.productDetail.inWishlist
                      : t.productDetail.addWishlist}
                  </button>

                  <button
                    type="button"
                    className={`detail-action-button ${
                      isInCompare(selectedProduct.id) ? "active" : ""
                    }`}
                    onClick={() => toggleCompare(selectedProduct)}
                  >
                    {isInCompare(selectedProduct.id)
                      ? t.productDetail.inCompare
                      : t.productDetail.addCompare}
                  </button>
                </div>
              </div>
            </div>

            <ProductReviews
              key={selectedProduct.productId || selectedProduct.id}
              productKey={selectedProduct.productId || selectedProduct.id}
              productName={selectedProduct.name}
            />
          </div>
        ) : (
          <>
            <div className="section-heading">
              {isSearching ? (
                <>
                  <span>{t.search.resultsKicker}</span>

                  <h2>{t.search.resultsHeading}</h2>

                  <p>
                    {activeProducts.length > 0
                      ? tr(t.search.found, {
                          count: activeProducts.length,
                          term: searchTerm,
                        })
                      : tr(t.search.notFound, {
                          term: searchTerm,
                        })}
                  </p>

                  <button
                    type="button"
                    className="back-to-categories"
                    onClick={() => setSearchTerm("")}
                  >
                    {t.search.clear}
                  </button>
                </>
              ) : isSpecial ? (
                <>
                  <span>
                    {specialView === "new"
                      ? t.newArrivals.kicker
                      : t.bestSellers.kicker}
                  </span>

                  <h2>
                    {specialView === "new"
                      ? t.newArrivals.heading
                      : t.bestSellers.heading}
                  </h2>

                  <p>
                    {specialView === "new"
                      ? t.newArrivals.subtitle
                      : t.bestSellers.subtitle}
                  </p>

                  <button
                    type="button"
                    className="back-to-categories"
                    onClick={backToCategories}
                  >
                    {t.back.allCategories}
                  </button>
                </>
              ) : showDatabaseProducts ? (
                <>
                  <span>FROM OUR SELLERS</span>

                  <h2>Seller Products</h2>

                  <p>
                    {databaseProductsLoading
                      ? "Loading seller products..."
                      : sellerOnlyProducts.length > 0
                      ? "Products added by our approved sellers."
                      : "No seller products are available yet."}
                  </p>

                  <button
                    type="button"
                    className="back-to-categories"
                    onClick={backToCategories}
                  >
                    {t.back.allCategories}
                  </button>
                </>
              ) : (
                <>
                  <span>
                    {showBagsProducts
                      ? t.sectionHeadings.bags.kicker
                      : showUKProducts
                      ? t.sectionHeadings.uk.kicker
                      : showIndiaProducts
                      ? t.sectionHeadings.india.kicker
                      : activeCategory === "JEWELLERY"
                      ? t.sectionHeadings.jewellery.kicker
                      : t.sectionHeadings.fashion.kicker}
                  </span>

                  <h2>
                    {showBagsProducts
                      ? `${activeCategory} ${t.common.products}`
                      : showUKProducts
                      ? t.sectionHeadings.uk.heading
                      : showIndiaProducts
                      ? t.sectionHeadings.india.heading
                      : activeCategory === "JEWELLERY"
                      ? t.sectionHeadings.jewellery.heading
                      : t.sectionHeadings.fashion.heading}
                  </h2>

                  <p>
                    {showBagsProducts
                      ? tr(t.sectionHeadings.bags.subtitle, {
                          category: activeCategory.toLowerCase(),
                        })
                      : showUKProducts
                      ? t.sectionHeadings.uk.subtitle
                      : showIndiaProducts
                      ? t.sectionHeadings.india.subtitle
                      : activeCategory === "JEWELLERY"
                      ? t.sectionHeadings.jewellery.subtitle
                      : t.sectionHeadings.fashion.subtitle}
                  </p>

                  {showBagsProducts && selectedBagCategory ? (
                    <button
                      className="back-to-categories"
                      onClick={backToBagCategories}
                    >
                      {t.back.bagsCategories}
                    </button>
                  ) : (
                    <button
                      className="back-to-categories"
                      onClick={backToCategories}
                    >
                      {t.back.allCategories}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="products-grid">
              {activeProducts.map((product) => (
                <div
                  className="product-card"
                  key={product.id || product.name}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-card-image">
                    <img src={product.image} alt={product.name} />

                    <span className="product-badge">
                      {t.productCard.badgeNew}
                    </span>

                    <div className="card-icon-buttons">
                      <button
                        type="button"
                        className={`card-icon-button ${
                          isInWishlist(product.id) ? "active" : ""
                        }`}
                        title="Wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        {isInWishlist(product.id) ? "♥" : "♡"}
                      </button>

                      <button
                        type="button"
                        className={`card-icon-button ${
                          isInCompare(product.id) ? "active" : ""
                        }`}
                        title="Compare"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(product);
                        }}
                      >
                        ⇄
                      </button>
                    </div>
                  </div>

                  <div className="product-card-info">
                    <h3>{product.name}</h3>

                    <div className="product-card-bottom">
                      <strong className="product-price">
                        {product.price}
                      </strong>

                      <button
                        type="button"
                        className="add-cart-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        {t.productCard.addToCart}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="shop-now-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        buyNow(product);
                      }}
                    >
                      {t.productCard.shopNow}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    )}

    {/* ================= FOOTER ================= */}

    <footer
      className="meer-footer"
      style={{
        background: "#171310",
        color: "#ddd3c4",
        marginTop: "70px",
        padding: "55px 7% 25px",
        borderTop: "1px solid #b08a4a",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: "45px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 12px",
              color: "#d9b66f",
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: "5px",
              fontWeight: "400",
            }}
          >
            MEER
          </h2>

          <div
            style={{
              color: "#aaa095",
              fontSize: "10px",
              letterSpacing: "3px",
              marginBottom: "18px",
            }}
          >
            LUXURY COLLECTION
          </div>

          <p
            style={{
              color: "#a9a09a",
              fontSize: "13px",
              lineHeight: "1.8",
              maxWidth: "360px",
              margin: 0,
            }}
          >
            Discover elegant fashion, jewellery, bags and exclusive
            collections crafted for modern luxury.
          </p>
        </div>

        <div>
          <h3
            style={{
              color: "#d9b66f",
              fontSize: "12px",
              letterSpacing: "2px",
              marginBottom: "18px",
            }}
          >
            QUICK LINKS
          </h3>

          <a href="#home" style={{ display: "block", color: "#aaa095", marginBottom: "10px", textDecoration: "none", fontSize: "12px" }}>
            Home
          </a>

          <a href="#categories" style={{ display: "block", color: "#aaa095", marginBottom: "10px", textDecoration: "none", fontSize: "12px" }}>
            Categories
          </a>

          <a href="#new-arrivals" style={{ display: "block", color: "#aaa095", marginBottom: "10px", textDecoration: "none", fontSize: "12px" }}>
            New Arrivals
          </a>

          <a href="#blogs" style={{ display: "block", color: "#aaa095", textDecoration: "none", fontSize: "12px" }}>
            Blogs
          </a>
        </div>

        <div>
          <h3
            style={{
              color: "#d9b66f",
              fontSize: "12px",
              letterSpacing: "2px",
              marginBottom: "18px",
            }}
          >
            CUSTOMER SERVICE
          </h3>

          <span
            style={{
              display: "block",
              color: "#aaa095",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            Shipping & Delivery
          </span>

          <span
            style={{
              display: "block",
              color: "#aaa095",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            Returns & Exchange
          </span>

          <span
            style={{
              display: "block",
              color: "#aaa095",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            Order Support
          </span>

          <span
            style={{
              display: "block",
              color: "#aaa095",
              fontSize: "12px",
            }}
          >
            Privacy & Terms
          </span>
        </div>

        <div>
          <h3
            style={{
              color: "#d9b66f",
              fontSize: "12px",
              letterSpacing: "2px",
              marginBottom: "18px",
            }}
          >
            CONTACT & FOLLOW
          </h3>

          <p style={{ color: "#aaa095", fontSize: "12px", margin: "0 0 10px" }}>
            Email:{" "}
            <a href="mailto:meerkhan1611@gmail.com" style={{ color: "#d9b66f", textDecoration: "none" }}>
              meerkhan1611@gmail.com
            </a>
          </p>

          <p style={{ color: "#aaa095", fontSize: "12px", margin: "0 0 10px" }}>
            Phone (PK):{" "}
            <a href="tel:+923105849046" style={{ color: "#d9b66f", textDecoration: "none" }}>
              03105849046
            </a>
          </p>

          <p style={{ color: "#aaa095", fontSize: "12px", margin: "0 0 10px" }}>
            Phone (UK):{" "}
            <a href="tel:+447402265563" style={{ color: "#d9b66f", textDecoration: "none" }}>
              +447402265563
            </a>
          </p>

          <p style={{ color: "#aaa095", fontSize: "12px", margin: "0 0 18px" }}>
            Address: Store Address
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <a href="#" style={{ color: "#d9b66f", border: "1px solid #8d6b34", padding: "8px 12px", textDecoration: "none", fontSize: "11px" }}>
              Instagram
            </a>

            <a href="#" style={{ color: "#d9b66f", border: "1px solid #8d6b34", padding: "8px 12px", textDecoration: "none", fontSize: "11px" }}>
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "40px auto 0",
          paddingTop: "20px",
          borderTop: "1px solid #3a3029",
          textAlign: "center",
          color: "#81776f",
          fontSize: "11px",
          letterSpacing: "1px",
        }}
      >
        © 2026 Meer Luxury Collection. All Rights Reserved.
      </div>
    </footer>
  </div>
);
}

export default App;