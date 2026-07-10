import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, b as useMatch, O as Outlet, H as HeadContent, S as Scripts, d as createFileRoute, l as lazyRouteComponent, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { C as ClerkProvider, U as UserButton, S as SignedOut, a as SignedIn } from "../_libs/clerk__clerk-react.mjs";
import { i as instance } from "../_libs/i18next.mjs";
import { u as useTranslation, I as I18nextProvider, i as initReactI18next } from "../_libs/react-i18next.mjs";
import { S as Search, H as Heart, a as ShoppingBag, G as Globe, X, M as Menu, T as Twitter, F as Facebook, Y as Youtube, I as Instagram, C as ChevronDown } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clerk__shared.mjs";
import "../_libs/swr.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/dequal.mjs";
const appCss = "/assets/styles-CalbXX2Y.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const shoe = "/assets/shoe-1-DhKtNOE4.png";
const shoe2$1 = "/assets/shoe-2-DGb4RtCU.png";
const shoe3 = "/assets/shoe-3-VCupfiF2.png";
const shoe4 = "/assets/shoe-4-BHnmBPMo.png";
const shoe5 = "/assets/shoe-5-DwKC0cey.png";
const shoe2 = "/assets/shoe-6-6eg-vCnG.png";
const IMAGES = [shoe, shoe2$1, shoe3, shoe4, shoe5, shoe2];
const NAMES = [
  "AIT Shop Glide 1",
  "Velocity Runner",
  "Court Master 23",
  "Urban Drift",
  "Trail Blazer Pro",
  "Cloud Walk 270",
  "Street Icon Low",
  "Boost Trainer X",
  "Heritage Court 6",
  "Phantom Run",
  "Vapor Lite",
  "Studio Flex",
  "Hyper Pulse",
  "Apex Field",
  "Echo Lifestyle",
  "Summit Hike",
  "Pace Setter 90",
  "Glow Court",
  "Drift Mid",
  "Origin White"
];
const CATEGORIES = ["Running", "Basketball", "Lifestyle", "Training", "Sneakers", "Sale"];
const COLORS = ["#3B82F6", "#0EA5E9", "#EF4444", "#F59E0B", "#10B981", "#111827", "#FFFFFF"];
const products = NAMES.map((name, i) => ({
  id: `p-${i + 1}`,
  name,
  price: 89e3 + i * 13 % 191e3,
  oldPrice: i % 4 === 0 ? 89e3 + i * 13 % 191e3 + 4e4 : void 0,
  category: CATEGORIES[i % CATEGORIES.length],
  description: "Engineered for everyday performance. Breathable mesh upper, responsive cushioning, and a durable rubber outsole built to keep up with your stride — from city blocks to weekend trails.",
  colors: [
    COLORS[i % COLORS.length],
    COLORS[(i + 2) % COLORS.length],
    COLORS[(i + 4) % COLORS.length]
  ],
  sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  image: IMAGES[i % IMAGES.length],
  images: [IMAGES[i % IMAGES.length]],
  rating: 3.5 + i * 7 % 15 / 10,
  badge: i % 5 === 0 ? "New" : i % 7 === 0 ? "-30%" : void 0,
  stock: i % 9 === 0 ? 0 : 10 + i * 3
}));
const categories = [
  { slug: "running", name: "Running", count: 24, tagline: "Built for the long run." },
  { slug: "basketball", name: "Basketball", count: 18, tagline: "Own the court." },
  { slug: "lifestyle", name: "Lifestyle", count: 32, tagline: "Everyday icons." },
  { slug: "training", name: "Training", count: 21, tagline: "Push your limits." },
  { slug: "sneakers", name: "Sneakers", count: 40, tagline: "Street-ready classics." },
  { slug: "sale", name: "Sale", count: 12, tagline: "Up to 50% off." }
];
products[5];
const Ctx = reactExports.createContext(null);
function StoreProvider({ children }) {
  const [cart, setCart] = reactExports.useState([]);
  const [wishlist, setWishlist] = reactExports.useState([]);
  const addToCart = reactExports.useCallback((p, size = 42, color = p.colors[0], qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === p.id && i.size === size && i.color === color);
      if (existing) {
        return c.map((i) => i === existing ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...c, { product: p, size, color, quantity: qty }];
    });
  }, []);
  const removeFromCart = reactExports.useCallback(
    (id, size, color) => setCart((c) => c.filter((i) => !(i.product.id === id && i.size === size && i.color === color))),
    []
  );
  const updateQty = reactExports.useCallback(
    (id, qty, size, color) => setCart(
      (c) => c.map(
        (i) => i.product.id === id && i.size === size && i.color === color ? { ...i, quantity: Math.max(1, qty) } : i
      )
    ),
    []
  );
  const toggleWishlist = reactExports.useCallback(
    (id) => setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]),
    []
  );
  const clearCart = reactExports.useCallback(() => setCart([]), []);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQty,
        toggleWishlist,
        cartCount,
        cartTotal,
        clearCart
      },
      children
    }
  );
}
const useStore = () => {
  const v = reactExports.useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
};
const KEY = "pk_test_aGVscGVkLWxvdXNlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";
function SafeClerkProvider({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ClerkProvider, { publishableKey: KEY, children });
}
function SignedInWrapper({ children }) {
  if (typeof window === "undefined") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SignedIn, { children });
}
function SignedOutWrapper({ children }) {
  if (typeof window === "undefined") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SignedOut, { children });
}
const resources = {
  en: {
    translation: {
      common: {
        home: "Home",
        shop: "Shop",
        categories: "Categories",
        newArrivals: "New Arrivals",
        sale: "Sale",
        contact: "Contact",
        admin: "Admin",
        search: "Search",
        wishlist: "Wishlist",
        cart: "Cart",
        signIn: "Sign in",
        signOut: "Sign out",
        searchPlaceholder: "Search shoes, brands, categories...",
        goHome: "Go home",
        tryAgain: "Try again",
        addToCart: "Add to cart",
        shopNow: "Shop now",
        viewAll: "View all",
        featured: "Featured",
        bestSellers: "Best sellers",
        size: "Size",
        color: "Color",
        quantity: "Quantity",
        description: "Description",
        rating: "Rating",
        price: "Price",
        oldPrice: "Old price",
        stock: "Stock",
        name: "Name",
        category: "Category",
        badge: "Badge",
        image: "Image",
        optional: "Optional",
        colors: "Colors",
        sizes: "Sizes",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        update: "Update",
        loading: "Loading...",
        details: "Details",
        back: "Back",
        items: "items",
        noResults: "No results",
        allRightsReserved: "All Rights Reserved.",
        stores: "Stores",
        findStore: "Find a store",
        newsletter: "Newsletter",
        becomeMember: "Become a member",
        siteFeedback: "Site feedback",
        help: "Help",
        orderStatus: "Order status",
        shippingDelivery: "Shipping & Delivery",
        returns: "Returns",
        paymentOptions: "Payment options",
        contactUs: "Contact us",
        aboutAITShop: "About AIT Shop",
        news: "News",
        careers: "Careers",
        investors: "Investors",
        sustainability: "Sustainability",
        socials: "Socials",
        catalog: "Catalog",
        termsOfUse: "Terms of Use",
        privacy: "Privacy",
        dashboard: "Dashboard",
        orders: "Orders",
        customers: "Customers",
        products: "Products",
        actions: "Actions",
        product: "Product",
        date: "Date",
        status: "Status",
        amount: "Amount",
        joined: "Joined",
        spent: "Spent",
        role: "Role",
        payment: "Payment",
        subtotal: "Subtotal",
        shipping: "Shipping",
        free: "Free",
        discount: "Discount",
        total: "Total",
        checkout: "Checkout",
        email: "Email",
        phone: "Phone",
        address: "Address",
        firstName: "First name",
        lastName: "Last name",
        city: "City",
        state: "State",
        zip: "ZIP",
        country: "Country",
        promoCode: "Promo code",
        apply: "Apply",
        language: "EN",
        inStock: "In stock",
        outOfStock: "Out of stock",
        onlyLeft: "Only {{count}} left",
        lowStock: "Low stock",
        upTo: "Up to"
      },
      error: {
        pageNotFound: "Page not found",
        pageNotExist: "The page you're looking for doesn't exist or has been moved.",
        pageNotLoad: "This page didn't load",
        somethingWrong: "Something went wrong. Try again or head home."
      },
      home: {
        featuredDrop: "Featured drop",
        thisWeeksPicks: "This week's picks",
        shopByCategory: "Shop by category",
        lovedByEveryone: "Loved by everyone"
      },
      shop: {
        title: "All Sneakers",
        subtitle: "Refine by size, color, price and category to find your next pair.",
        filters: "Filters",
        showResults: "Show results ({{count}})",
        newest: "Newest",
        priceLowHigh: "Price: Low to High",
        priceHighLow: "Price: High to Low",
        popular: "Popular",
        products: "products"
      },
      product: {
        reviews: "reviews",
        freeDelivery: "Free delivery",
        ordersOver: "Orders over $100",
        returns30: "30-day returns",
        hassleFree: "Hassle-free",
        secureCheckout: "Secure checkout",
        encrypted: "Encrypted",
        youMightAlsoLike: "You might also like"
      },
      cart: {
        empty: "Your cart is empty",
        emptyDesc: "Add some kicks to get rolling.",
        continueShopping: "Continue shopping",
        title: "Your Cart",
        orderSummary: "Order summary",
        promoHint: "Try code AITSHOP10",
        checkout: "Checkout",
        size: "Size"
      },
      wishlist: {
        empty: "Your wishlist is empty",
        emptyDesc: "Save your favorite kicks for later.",
        browseShop: "Browse shop",
        moveToCart: "Move to cart"
      },
      search: {
        placeholder: "Search sneakers, categories...",
        typeToSearch: "Type to start searching.",
        noResults: "No results for",
        noResultsHint: "Try a different keyword.",
        results: "result(s) for"
      },
      admin: {
        title: "Admin",
        dashboard: "Dashboard",
        weeklyTrend: "Weekly Trend",
        recentOrders: "Recent Orders",
        orderId: "Order ID",
        allOrders: "All Orders",
        noOrders: "No orders yet — place an order from the shop first!",
        noCustomers: "No customers yet — they appear after their first purchase.",
        addProduct: "Add Product",
        productList: "Product List",
        addNew: "Add New Product",
        loadingProducts: "Loading products...",
        noMatch: "No products match your search",
        noProducts: "No products yet",
        productName: "Product Name *",
        uploadImage: "Upload image",
        addImages: "Add images",
        noImages: "No images yet — upload at least one",
        firstImageIsCover: "First image is the cover shown in listings",
        moveFirst: "Make cover",
        images: "Images",
        uploading: "Uploading...",
        colorsHint: "Colors (comma-separated hex, e.g. #ff0000,#000)",
        sizesHint: "Sizes (comma-separated, e.g. 38,39,40,41)",
        descPlaceholder: "Product description...",
        saving: "Saving...",
        saveProduct: "Save product",
        accessRequired: "Admin Access",
        signInPrompt: "Sign in to access the admin dashboard.",
        created: "Product created!",
        failedCreate: "Failed to create product",
        imageUploaded: "Image uploaded!",
        imageUploadFailed: "Image upload failed",
        updated: "Product updated!",
        failedUpdate: "Failed to update",
        deleted: "Product deleted",
        deleteConfirm: 'Delete "{{name}}"? This cannot be undone.',
        guest: "Guest",
        totalLabel: "total",
        searchPlaceholder: "Search..."
      },
      checkout: {
        emptyCart: "Cart is empty",
        emptyDesc: "Add some products before checking out.",
        shopNow: "Shop now",
        title: "Checkout",
        secureCheckout: "Secure checkout",
        contact: "Contact",
        shippingAddress: "Shipping address",
        delivery: "Delivery method",
        standard: "Standard",
        express: "Express",
        days35: "3–5 business days",
        days12: "1–2 business days",
        qpay: "QPay",
        qpayDesc: "Scan QR code with QPay app",
        qpayNote: "Demo — no real payment is made",
        scanQpay: "Scan with QPay app",
        pickupStore: "Pay at pickup",
        pickupStoreDesc: "Visit our store and pay with cash or bank transfer",
        pickupAddress: "In-store pickup",
        storeAddress: "Store location",
        storeAddressVal: "120 Chinggis Ave, Ulaanbaatar",
        storeHours: "Mon–Sat 10:00–20:00 · Sun 11:00–18:00",
        processing: "Processing…",
        approved: "Order confirmed!",
        placeOrder: "Place order",
        backToCart: "Back to cart",
        emailRequired: "Email is required",
        phoneRequired: "Phone number is required",
        failed: "Order placement failed. Please try again.",
        orderLabel: "Order",
        qty: "Qty"
      },
      categories: {
        browse: "Browse",
        all: "All Categories",
        shop: "Shop {{name}} →"
      },
      sale: {
        tag: "Limited time",
        title: "Sale — up to 50% off",
        subtitle: "Selected styles at unbeatable prices. While stocks last."
      },
      newArrivals: {
        tag: "Just dropped",
        title: "New Arrivals",
        subtitle: "The latest silhouettes from the AIT Shop design lab. Be the first to step in them."
      },
      contact: {
        title: "Contact",
        heading: "Get in touch",
        desc: "Questions about a product, an order, or anything else? We'd love to hear from you.",
        flagship: "Flagship",
        sendMessage: "Send a message",
        subject: "Subject",
        message: "Message",
        send: "Send message",
        hours: "Mon–Sat 10am–8pm · Sun 11am–6pm",
        faq: "Frequently asked questions",
        q1: "How long does shipping take?",
        a1: "Standard shipping takes 3–5 business days. Express is 1–2 business days.",
        q2: "What is your return policy?",
        a2: "We accept returns within 30 days of purchase, no questions asked.",
        q3: "Do you ship internationally?",
        a3: "Yes, we ship to over 50 countries. International shipping takes 7–14 business days.",
        q4: "How do I track my order?",
        a4: "Once your order ships, you'll receive a tracking number via email."
      },
      orderSuccess: {
        title: "Thanks for your order!",
        desc: "A confirmation email is on its way. Your order number is #{{id}}.",
        whatsNext: "What's next?",
        step1: "We'll prepare your order for pickup",
        step2: "We'll contact you to confirm when it's ready",
        step3: "Bring your confirmation and pay with cash or bank transfer at the store",
        continueShopping: "Continue shopping"
      },
      profile: {
        title: "Profile",
        orders: "Orders",
        addresses: "Addresses",
        settings: "Settings",
        signInPrompt: "Sign in to view your profile",
        signInDesc: "Your orders and account details are waiting for you.",
        myAccount: "My Account",
        memberSince: "Member since {{year}}",
        profileInfo: "Profile information",
        clerkNote: "Profile updates are managed through your Clerk account settings.",
        orderHistory: "Order history",
        loadingOrders: "Loading orders…",
        noOrders: "No orders yet.",
        startShopping: "Start shopping",
        savedAddresses: "Saved addresses",
        defaultLabel: "Default",
        homeLabel: "Home",
        addressHint: "Add your address during checkout — it will appear here.",
        addAddress: "+ Add new address",
        accountSettings: "Account settings",
        emailNotif: "Email notifications",
        emailNotifDesc: "Updates, drops, and offers",
        smsAlerts: "SMS alerts",
        smsAlertsDesc: "Order status and shipping",
        personalized: "Personalized recommendations",
        personalizedDesc: "Tailored picks for you"
      },
      about: {
        storyTag: "Our story",
        headline: "Built for the next step.",
        intro: "AIT Shop started in 2017 with one idea: sneakers should feel as good as they look. From a tiny garage in Portland to a global community of runners, ballers, and creatives, we've kept that promise.",
        statPairs: "Pairs sold",
        statCountries: "Countries shipped",
        statPartners: "Retail partners",
        statHappy: "Happy customers",
        missionTag: "Mission",
        missionHeading: "Move more. Move better.",
        missionDesc: "Every pair we ship is designed to help you move with confidence — whether that's a marathon, a morning walk, or a midnight skate. We believe movement is a universal language and we're here to make it more accessible, more sustainable, and a whole lot more fun.",
        valuesHeading: "What we stand for",
        craftTitle: "Craft",
        craftDesc: "Obsessed with every stitch, every seam, every step.",
        perfTitle: "Performance",
        perfDesc: "Engineered with athletes for athletes — and everyone in between.",
        respTitle: "Responsibility",
        respDesc: "Recycled materials, ethical factories, transparent supply chains."
      },
      login: {
        signIn: "Sign in",
        register: "Register",
        welcomeBack: "Welcome back",
        createAccount: "Create your account",
        signInDesc: "Sign in to your AIT Shop account",
        registerDesc: "Join the AIT Shop community today",
        memberPerks: "Become a member to unlock exclusive drops, early access, and free shipping on every order."
      },
      findStore: {
        tag: "Stores",
        title: "Find a store",
        desc: "We currently have one location, with more on the way as we grow.",
        addressLabel: "Address",
        address: "120 Chinggis Ave, Ulaanbaatar, Mongolia",
        hoursLabel: "Hours",
        hours: "Mon–Sat 10:00–20:00 · Sun 11:00–18:00",
        pickupNote: "You can also choose in-store pickup at checkout and pay when you arrive."
      },
      newsletter: {
        tag: "Stay in the loop",
        title: "Newsletter",
        desc: "New drops, restocks, and members-only offers — straight to your inbox.",
        placeholder: "you@example.com",
        subscribe: "Subscribe",
        success: "Subscribed! Watch your inbox for our next drop.",
        privacyNote: "We'll only email you about AIT Shop. Unsubscribe anytime."
      },
      feedback: {
        tag: "We're listening",
        title: "Site feedback",
        desc: "Found a bug, or have an idea to make AIT Shop better? Tell us.",
        label: "Your feedback",
        placeholder: "What's on your mind?",
        send: "Send feedback",
        success: "Thanks for the feedback — we read every message."
      },
      shippingPage: {
        tag: "Help",
        title: "Shipping & Delivery",
        desc: "How long it takes and what it costs, by delivery method.",
        standardTitle: "Standard delivery",
        standardDesc: "3–5 business days. Free on orders over ₮340,000, otherwise ₮40,800.",
        expressTitle: "Express delivery",
        expressDesc: "1–2 business days for ₮61,200.",
        pickupTitle: "In-store pickup",
        pickupDesc: "Free. Choose pickup at checkout and collect at our Ulaanbaatar store once your order is ready."
      },
      returnsPage: {
        tag: "Help",
        title: "Returns",
        desc: "Not the right fit? Send it back within 30 days, no questions asked.",
        step1Title: "1. Start a return",
        step1Desc: "Contact us with your order number and which item you'd like to return.",
        step2Title: "2. Send it back",
        step2Desc: "Items must be unworn, in original packaging, within 30 days of delivery.",
        step3Title: "3. Get refunded",
        step3Desc: "Once we receive your return, your refund is issued to your original payment method."
      },
      paymentPage: {
        tag: "Help",
        title: "Payment options",
        desc: "Pay when you pick up — we accept cash or bank transfer at our store.",
        cashTitle: "Cash",
        cashDesc: "Pay the exact amount in cash when you arrive at our store to collect your order.",
        bankTitle: "Bank Transfer",
        bankDesc: "Transfer to our bank account and notify us. We will confirm receipt and have your order ready for pickup.",
        pickupTitle: "Pay at pickup",
        pickupDesc: "Reserve online and pay in person (cash or bank transfer) when you collect your order in-store."
      },
      newsPage: {
        tag: "AIT Shop",
        title: "News",
        desc: "Announcements and updates from AIT Shop.",
        empty: "No news yet — check back soon."
      },
      careersPage: {
        tag: "AIT Shop",
        title: "Careers",
        desc: "We're not actively hiring right now, but we're always happy to hear from people who love what we do.",
        cta: "Interested in working with us? Reach out and tell us a bit about yourself.",
        button: "Contact us"
      },
      investorsPage: {
        tag: "AIT Shop",
        title: "Investors",
        desc: "AIT Shop is an independent, founder-run shop. For partnership or investment inquiries, we'd love to hear from you.",
        button: "Get in touch"
      },
      sustainabilityPage: {
        tag: "AIT Shop",
        title: "Sustainability",
        desc: "Small steps, taken consistently, add up.",
        materialsTitle: "Recycled materials",
        materialsDesc: "We prioritize recycled and responsibly-sourced materials wherever the design allows it.",
        factoriesTitle: "Ethical factories",
        factoriesDesc: "We work only with manufacturing partners who meet fair labor standards.",
        supplyTitle: "Transparent supply chain",
        supplyDesc: "We're working towards full visibility into where every component of every shoe comes from."
      }
    }
  },
  mn: {
    translation: {
      common: {
        home: "Нүүр",
        shop: "Дэлгүүр",
        categories: "Ангилал",
        newArrivals: "Шинэ бараа",
        sale: "Хямдрал",
        contact: "Холбоо барих",
        admin: "Удирдлага",
        search: "Хайх",
        wishlist: "Хадгалсан",
        cart: "Сагс",
        signIn: "Нэвтрэх",
        signOut: "Гарах",
        searchPlaceholder: "Гутал, брэнд, ангилал хайх...",
        goHome: "Нүүр хуудас",
        tryAgain: "Дахин оролдох",
        addToCart: "Сагсанд нэмэх",
        shopNow: "Одоо авах",
        viewAll: "Бүгдийг харах",
        featured: "Онцлох",
        bestSellers: "Хамгийн их борлуулалттай",
        size: "Хэмжээ",
        color: "Өнгө",
        quantity: "Тоо",
        description: "Тайлбар",
        rating: "Үнэлгээ",
        price: "Үнэ",
        oldPrice: "Хуучин үнэ",
        stock: "Нөөц",
        name: "Нэр",
        category: "Ангилал",
        badge: "Тэмдэглэгээ",
        image: "Зураг",
        optional: "Заавал биш",
        colors: "Өнгөнүүд",
        sizes: "Хэмжээнүүд",
        cancel: "Цуцлах",
        save: "Хадгалах",
        delete: "Устгах",
        update: "Шинэчлэх",
        loading: "Уншиж байна...",
        details: "Дэлгэрэнгүй",
        back: "Буцах",
        items: "бүтээгдэхүүн",
        noResults: "Үр дүн олдсонгүй",
        allRightsReserved: "Бүх эрх хуулиар хамгаалагдсан.",
        stores: "Дэлгүүрүүд",
        findStore: "Дэлгүүр хайх",
        newsletter: "Мэдээний захидал",
        becomeMember: "Гишүүн болох",
        siteFeedback: "Санал хүсэлт",
        help: "Тусламж",
        orderStatus: "Захиалгын байдал",
        shippingDelivery: "Хүргэлт",
        returns: "Буцаалт",
        paymentOptions: "Төлбөрийн хэлбэр",
        contactUs: "Холбоо барих",
        aboutAITShop: "AIT Shop тухай",
        news: "Мэдээ",
        careers: "Ажлын байр",
        investors: "Хөрөнгө оруулагчид",
        sustainability: "Тогтвортой байдал",
        socials: "Сошиал",
        catalog: "Каталог",
        termsOfUse: "Үйлчилгээний нөхцөл",
        privacy: "Нууцлал",
        dashboard: "Хяналтын самбар",
        orders: "Захиалгууд",
        customers: "Хэрэглэгчид",
        products: "Бүтээгдэхүүн",
        actions: "Үйлдэл",
        product: "Бүтээгдэхүүн",
        date: "Огноо",
        status: "Төлөв",
        amount: "Дүн",
        joined: "Нэгдсэн",
        spent: "Зарцуулсан",
        role: "Үүрэг",
        payment: "Төлбөр",
        subtotal: "Дэд нийт",
        shipping: "Хүргэлт",
        free: "Үнэгүй",
        discount: "Хөнгөлөлт",
        total: "Нийт дүн",
        checkout: "Захиалга хийх",
        email: "И-мэйл",
        phone: "Утас",
        address: "Хаяг",
        firstName: "Нэр",
        lastName: "Овог",
        city: "Хот",
        state: "Муж",
        zip: "Шуудангийн дугаар",
        country: "Улс",
        promoCode: "Промо код",
        apply: "Хэрэглэх",
        language: "МН",
        inStock: "Нөөцтэй",
        outOfStock: "Нөөцгүй",
        onlyLeft: "Зөвхөн {{count}} үлдсэн",
        lowStock: "Нөөц багатай",
        upTo: "Хүртэл"
      },
      error: {
        pageNotFound: "Хуудас олдсонгүй",
        pageNotExist: "Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.",
        pageNotLoad: "Хуудас ачааллагдсангүй",
        somethingWrong: "Алдаа гарлаа. Дахин оролдох эсвэл нүүр хуудас руу орно уу."
      },
      home: {
        featuredDrop: "Онцлох бүтээгдэхүүн",
        thisWeeksPicks: "Энэ долоо хоногийн сонголт",
        shopByCategory: "Ангиллаар авах",
        lovedByEveryone: "Хамгийн их дуртай"
      },
      shop: {
        title: "Бүх гутал",
        subtitle: "Хэмжээ, өнгө, үнэ, ангиллаар шүүж дараагийн гуталаа олоорой.",
        filters: "Шүүлт",
        showResults: "Үр дүн харуулах ({{count}})",
        newest: "Шинэ эхлэлтэй",
        priceLowHigh: "Үнэ: бага → их",
        priceHighLow: "Үнэ: их → бага",
        popular: "Алдартай",
        products: "бүтээгдэхүүн"
      },
      product: {
        reviews: "үнэлгээ",
        freeDelivery: "Үнэгүй хүргэлт",
        ordersOver: "₮340,000-аас дээш захиалга",
        returns30: "30 хоногийн буцаалт",
        hassleFree: "Асуудалгүй",
        secureCheckout: "Найдвартай төлбөр",
        encrypted: "Шифрлэгдсэн",
        youMightAlsoLike: "Танд таалагдаж болох"
      },
      cart: {
        empty: "Таны сагс хоосон байна",
        emptyDesc: "Дуртай гуталаа сагсанд нэмэерэй.",
        continueShopping: "Дэлгүүрлэлтийг үргэлжлүүлэх",
        title: "Таны сагс",
        orderSummary: "Захиалгын дүн",
        promoHint: "AITSHOP10 кодыг оролдоорой",
        checkout: "Захиалга хийх",
        size: "Хэмжээ"
      },
      wishlist: {
        empty: "Таны хадгалсан жагсаалт хоосон",
        emptyDesc: "Дуртай гуталаа хадгалаарай.",
        browseShop: "Дэлгүүр үзэх",
        moveToCart: "Сагсанд нэмэх"
      },
      search: {
        placeholder: "Гутал, ангилал хайх...",
        typeToSearch: "Хайхын тулд бичнэ үү.",
        noResults: "Хайлтын үр дүн олдсонгүй:",
        noResultsHint: "Өөр үгээр хайж үзнэ үү.",
        results: "үр дүн:"
      },
      admin: {
        title: "Удирдлага",
        dashboard: "Хяналтын самбар",
        weeklyTrend: "Долоо хоногийн чиг хандлага",
        recentOrders: "Сүүлийн захиалгууд",
        orderId: "Захиалгын дугаар",
        allOrders: "Бүх захиалга",
        noOrders: "Захиалга байхгүй — дэлгүүрээс захиалга хийнэ үү!",
        noCustomers: "Хэрэглэгч байхгүй — анхны худалдааны дараа гарч ирнэ.",
        addProduct: "Бүтээгдэхүүн нэмэх",
        productList: "Бүтээгдэхүүний жагсаалт",
        addNew: "Шинэ бүтээгдэхүүн нэмэх",
        loadingProducts: "Бүтээгдэхүүн уншиж байна...",
        noMatch: "Хайлтад таарах бүтээгдэхүүн олдсонгүй",
        noProducts: "Бүтээгдэхүүн байхгүй",
        productName: "Бүтээгдэхүүний нэр *",
        uploadImage: "Зураг байршуулах",
        addImages: "Зураг нэмэх",
        noImages: "Зураг байхгүй — нэгийг байршуулна уу",
        firstImageIsCover: "Эхний зураг жагсаалтад харагдах нүүр зураг болно",
        moveFirst: "Нүүр зураг болгох",
        images: "Зурагнууд",
        uploading: "Байршуулж байна...",
        colorsHint: "Өнгөнүүд (таслалаар тусгаарлан, жишээ нь #ff0000,#000)",
        sizesHint: "Хэмжээнүүд (таслалаар тусгаарлан, жишээ нь 38,39,40,41)",
        descPlaceholder: "Бүтээгдэхүүний тайлбар...",
        saving: "Хадгалж байна...",
        saveProduct: "Бүтээгдэхүүн хадгалах",
        accessRequired: "Админ эрх шаардлагатай",
        signInPrompt: "Удирдлагын самбарт нэвтрэхийн тулд нэвтрэнэ үү.",
        created: "Бүтээгдэхүүн үүслээ!",
        failedCreate: "Үүсгэхэд алдаа гарлаа",
        imageUploaded: "Зураг байршлаа!",
        imageUploadFailed: "Зураг байршуулахад алдаа гарлаа",
        updated: "Бүтээгдэхүүн шинэчлэгдлээ!",
        failedUpdate: "Шинэчлэхэд алдаа гарлаа",
        deleted: "Бүтээгдэхүүн устлаа",
        deleteConfirm: '"{{name}}" устгах уу? Энэ үйлдлийг буцааж болохгүй.',
        guest: "Зочин",
        totalLabel: "нийт",
        searchPlaceholder: "Хайх..."
      },
      checkout: {
        emptyCart: "Сагс хоосон байна",
        emptyDesc: "Захиалга хийхийн өмнө бүтээгдэхүүн нэмнэ үү.",
        shopNow: "Дэлгүүр руу очих",
        title: "Захиалга хийх",
        secureCheckout: "Найдвартай захиалга",
        contact: "Холбоо барих",
        shippingAddress: "Хүргэлтийн хаяг",
        delivery: "Хүргэлтийн арга",
        standard: "Энгийн",
        express: "Яаралтай",
        days35: "3–5 ажлын өдөр",
        days12: "1–2 ажлын өдөр",
        qpay: "QPay",
        qpayDesc: "QPay апп-аар QR код уншуулан төлнө",
        qpayNote: "Туршилтын орчин — бодит төлбөр авахгүй",
        scanQpay: "QPay апп-аар уншуулна уу",
        pickupStore: "Дэлгүүрт ирж авах",
        pickupStoreDesc: "Дэлгүүрт ирж газар дээр нь төлнө",
        pickupAddress: "Дэлгүүрт ирж авах",
        storeAddress: "Дэлгүүрийн хаяг",
        storeAddressVal: "Чингис өргөн чөлөө 120, Улаанбаатар",
        storeHours: "Да–Ба 10:00–20:00 · Ня 11:00–18:00",
        processing: "Боловсруулж байна...",
        approved: "Захиалга баталгаажлаа!",
        placeOrder: "Захиалга хийх",
        backToCart: "Сагс руу буцах",
        emailRequired: "И-мэйл хаяг шаардлагатай",
        phoneRequired: "Утасны дугаар шаардлагатай",
        failed: "Захиалга амжилтгүй боллоо. Дахин оролдоно уу.",
        orderLabel: "Захиалга",
        qty: "Тоо"
      },
      categories: {
        browse: "Үзэх",
        all: "Бүх ангилал",
        shop: "{{name}} авах →"
      },
      sale: {
        tag: "Хязгаарлагдмал хугацаа",
        title: "Хямдрал — 50% хүртэл",
        subtitle: "Сонгосон загварууд хамгийн хямд үнээр. Нөөц дуусахаас өмнө авахаарай."
      },
      newArrivals: {
        tag: "Шинэ ирлээ",
        title: "Шинэ бараа",
        subtitle: "AIT Shop загварын лабораторийн хамгийн сүүлийн загварууд. Хамгийн түрүүн өмсөөрэй."
      },
      contact: {
        title: "Холбоо барих",
        heading: "Бидэнтэй холбогдоорой",
        desc: "Бүтээгдэхүүн, захиалга эсвэл өөр зүйлийн талаар асуулт байна уу? Бид таны саналыг сонсох дуртай.",
        flagship: "Үндсэн дэлгүүр",
        sendMessage: "Мессеж илгээх",
        subject: "Гарчиг",
        message: "Мессеж",
        send: "Мессеж илгээх",
        hours: "Да–Ба 10:00–20:00 · Ня 11:00–18:00",
        faq: "Түгээмэл асуултууд",
        q1: "Хүргэлт хэдэн хоног болдог вэ?",
        a1: "Энгийн хүргэлт 3–5 ажлын өдөр болдог. Яаралтай хүргэлт 1–2 ажлын өдөр.",
        q2: "Буцаалтын бодлого ямар байдаг вэ?",
        a2: "Худалдан авснаас хойш 30 хоногийн дотор асуулгүй буцаалт хийж болно.",
        q3: "Олон улсад хүргэлт хийдэг үү?",
        a3: "Тийм ээ, 50 гаруй улс руу хүргэлт хийдэг. Олон улсын хүргэлт 7–14 ажлын өдөр болдог.",
        q4: "Захиалгаа хэрхэн хянах вэ?",
        a4: "Захиалга илгээгдсэний дараа и-мэйлээр хянах дугаар илгээгдэнэ."
      },
      orderSuccess: {
        title: "Захиалгыг баярлалаа!",
        desc: "Баталгаажуулах и-мэйл илгээгдлээ. Таны захиалгын дугаар: #{{id}}.",
        whatsNext: "Дараа нь юу болох вэ?",
        step1: "Таны захиалгыг авах боломжтой болгон бэлтгэнэ",
        step2: "Бэлтгэгдсэний дараа холбогдох утсаар баталгаажуулна уу",
        step3: "Баталгаажуулалтыг авч дэлгүүрт ирж бэлэн мөнгө эсвэл банкны шилжүүлгээр төлнө",
        continueShopping: "Дэлгүүрлэлтийг үргэлжлүүлэх"
      },
      profile: {
        title: "Профайл",
        orders: "Захиалгууд",
        addresses: "Хаягууд",
        settings: "Тохиргоо",
        signInPrompt: "Профайлаа харахын тулд нэвтрэнэ үү",
        signInDesc: "Таны захиалга болон бүртгэлийн мэдээлэл хүлээж байна.",
        myAccount: "Миний бүртгэл",
        memberSince: "{{year}} оноос гишүүн",
        profileInfo: "Профайлын мэдээлэл",
        clerkNote: "Профайлын мэдээллийг Clerk бүртгэлийн тохиргооноос удирддаг.",
        orderHistory: "Захиалгын түүх",
        loadingOrders: "Захиалга уншиж байна...",
        noOrders: "Захиалга байхгүй.",
        startShopping: "Дэлгүүрлэж эхлэх",
        savedAddresses: "Хадгалсан хаягууд",
        defaultLabel: "Үндсэн",
        homeLabel: "Гэр",
        addressHint: "Захиалга хийхдээ хаягаа нэмнэ үү — энд гарч ирнэ.",
        addAddress: "+ Шинэ хаяг нэмэх",
        accountSettings: "Бүртгэлийн тохиргоо",
        emailNotif: "И-мэйл мэдэгдэл",
        emailNotifDesc: "Шинэчлэлт, санал",
        smsAlerts: "SMS мэдэгдэл",
        smsAlertsDesc: "Захиалгын байдал болон хүргэлт",
        personalized: "Хувийн зөвлөмж",
        personalizedDesc: "Танд тохируулсан сонголт"
      },
      about: {
        storyTag: "Бидний түүх",
        headline: "Дараагийн алхамд зориулагдсан.",
        intro: "AIT Shop 2017 онд нэг санаагаар эхэлсэн: гутал сайн харагдахын зэрэгцээ тав тухтай байх ёстой. Портлэндын жижиг гаражнаас дэлхийн хэмжээний гүйгчид, тоглогчид, бүтээлч хүмүүсийн нийгэмлэг болтол тэр амлалтаа биелүүлсээр ирлээ.",
        statPairs: "Хос борлуулсан",
        statCountries: "Улс руу хүргэсэн",
        statPartners: "Худалдааны түнш",
        statHappy: "Сэтгэл ханасан хэрэглэгч",
        missionTag: "Эрхэм зорилго",
        missionHeading: "Илүү хөдөл. Илүү сайн хөдөл.",
        missionDesc: "Бидний хүргэх гутал бүр таныг итгэлтэйгээр хөдлөхөд зориулагдсан — марафон ч бай, өглөөний алхалт ч бай, шөнийн скейт ч бай. Хөдөлгөөн бол нийтлэг хэл гэдэгт итгэдэг бөгөөд бид үүнийг илүү хүртээмжтэй, тогтвортой, хөгжилтэй болгоход оршдог.",
        valuesHeading: "Бидний үнэт зүйлс",
        craftTitle: "Гар урлал",
        craftDesc: "Оёдол, тавилт, алхам бүрт дуртайяа ажилладаг.",
        perfTitle: "Гүйцэтгэл",
        perfDesc: "Тамирчдаар тамирчдад зориулан бүтээгдсэн — болон дундаж хүн бүрт.",
        respTitle: "Хариуцлага",
        respDesc: "Дахин боловсруулсан материал, ёс зүйтэй үйлдвэр, ил тод нийлүүлэлтийн сүлжээ."
      },
      login: {
        signIn: "Нэвтрэх",
        register: "Бүртгүүлэх",
        welcomeBack: "Тавтай морил",
        createAccount: "Бүртгэл үүсгэх",
        signInDesc: "AIT Shop бүртгэлдээ нэвтрэх",
        registerDesc: "Өнөөдөр AIT Shop-д нэгдэх",
        memberPerks: "Гишүүн болж онцгой санал, эрт хандалт, үнэгүй хүргэлтийг авах."
      },
      findStore: {
        tag: "Дэлгүүрүүд",
        title: "Дэлгүүр хайх",
        desc: "Одоогоор бид нэг дэлгүүртэй бөгөөд цаашид өсөхийн хэрээр нэмэгдэх болно.",
        addressLabel: "Хаяг",
        address: "Чингис өргөн чөлөө 120, Улаанбаатар, Монгол улс",
        hoursLabel: "Цагийн хуваарь",
        hours: "Да–Ба 10:00–20:00 · Ня 11:00–18:00",
        pickupNote: "Захиалга хийхдээ дэлгүүрт ирж авах сонголтыг хийж, ирэхдээ төлбөрөө хийж болно."
      },
      newsletter: {
        tag: "Мэдээлэлтэй байгаарай",
        title: "Мэдээний захидал",
        desc: "Шинэ бараа, нөөц нөхөлт, гишүүдэд зориулсан онцгой саналуудыг имэйлээрээ аваарай.",
        placeholder: "tani@jishee.mn",
        subscribe: "Бүртгүүлэх",
        success: "Бүртгэгдлээ! Дараагийн шинэ барааг имэйлээрээ хүлээж аваарай.",
        privacyNote: "Бид зөвхөн AIT Shop-тэй холбоотой имэйл илгээх болно. Хүссэн үедээ цуцлах боломжтой."
      },
      feedback: {
        tag: "Бид сонсож байна",
        title: "Санал хүсэлт",
        desc: "Алдаа олсон уу, эсвэл AIT Shop-ийг сайжруулах санаа байна уу? Бидэнд хэлээрэй.",
        label: "Таны санал хүсэлт",
        placeholder: "Юу бодож байна вэ?",
        send: "Санал илгээх",
        success: "Санал хүсэлтэнд баярлалаа — бид мессеж бүрийг уншдаг."
      },
      shippingPage: {
        tag: "Тусламж",
        title: "Хүргэлт",
        desc: "Хүргэлтийн арга бүрийн хугацаа, үнийг харна уу.",
        standardTitle: "Энгийн хүргэлт",
        standardDesc: "3–5 ажлын өдөр. ₮340,000-аас дээш захиалга үнэгүй, бусад тохиолдолд ₮40,800.",
        expressTitle: "Яаралтай хүргэлт",
        expressDesc: "1–2 ажлын өдөр, ₮61,200.",
        pickupTitle: "Дэлгүүрт ирж авах",
        pickupDesc: "Үнэгүй. Захиалга хийхдээ дэлгүүрт ирж авах сонголтыг хийж, бэлэн болсон үед Улаанбаатар дэлгүүрээс авна уу."
      },
      returnsPage: {
        tag: "Тусламж",
        title: "Буцаалт",
        desc: "Тохирохгүй байна уу? 30 хоногийн дотор асуулгүйгээр буцаагаарай.",
        step1Title: "1. Буцаалт эхлүүлэх",
        step1Desc: "Захиалгын дугаар болон буцаах бараагаа бидэнд мэдэгдээрэй.",
        step2Title: "2. Буцаах бараагаа илгээх",
        step2Desc: "Бараа өмсөгдөөгүй, эх боодолтойгоор, хүргэгдснээс хойш 30 хоногийн дотор байх ёстой.",
        step3Title: "3. Мөнгөө буцаан авах",
        step3Desc: "Буцаасан бараа хүлээн авагдсаны дараа таны төлбөрийг эх төлбөрийн хэрэгслэлд буцаана."
      },
      paymentPage: {
        tag: "Тусламж",
        title: "Төлбөрийн хэлбэр",
        desc: "Авахдаа төлнө — бид нарад cash эсвэл банкны шилжүүлэг хүлээн зөвшөөрдөг.",
        cashTitle: "Бэлэн мөнгө",
        cashDesc: "Дэлгүүрт ирж захиалгаа авахдаа бэлэн мөнгөөр төлнө.",
        bankTitle: "Банкны шилжүүлэг",
        bankDesc: "Бидний банкны дансанд шилжүүлэг хийгээд мэдэгдэнэ үү. Бид хүлээн авсныг баталгаажуулаад захиалгаа бэлтгэнэ.",
        pickupTitle: "Авахдаа төлөх",
        pickupDesc: "Онлайнаар захиалж, дэлгүүрт ирж авахдаа бэлэн мөнгө эсвэл банкны шилжүүлгээр газар дээр нь төлнө үү."
      },
      newsPage: {
        tag: "AIT Shop",
        title: "Мэдээ",
        desc: "AIT Shop-ийн мэдэгдэл, шинэчлэлтүүд.",
        empty: "Одоогоор мэдээ байхгүй — дараа дахин хараарай."
      },
      careersPage: {
        tag: "AIT Shop",
        title: "Ажлын байр",
        desc: "Одоогоор бид ажилтан авч байгаагүй, гэхдээ бидэнтэй хамт ажиллахыг хүсэгчдээс сонсох дуртай.",
        cta: "Бидэнтэй хамт ажиллахыг хүсэж байна уу? Бичиж өөрийнхөөрөө танилцуулаарай.",
        button: "Холбоо барих"
      },
      investorsPage: {
        tag: "AIT Shop",
        title: "Хөрөнгө оруулагчид",
        desc: "AIT Shop бол үндсэн байгуулагчдаараа удирддаг бие даасан дэлгүүр юм. Хамтын ажиллагаа, хөрөнгө оруулалтын асуудлаар бидэнтэй холбогдоорой.",
        button: "Холбогдох"
      },
      sustainabilityPage: {
        tag: "AIT Shop",
        title: "Тогтвортой байдал",
        desc: "Тогтмол хийсэн жижиг алхамууд цаг хугацаанд хуримтлагддаг.",
        materialsTitle: "Дахин боловсруулсан материал",
        materialsDesc: "Боломжтой бүх тохиолдолд дахин боловсруулсан, хариуцлагатай эх үүсвэрээс гаралтай материалыг ашигладаг.",
        factoriesTitle: "Ёс зүйтэй үйлдвэрүүд",
        factoriesDesc: "Бид зөвхөн хөдөлмөрийн шударга стандартыг хангасан үйлдвэрлэлийн түншүүдтэй хамтран ажилладаг.",
        supplyTitle: "Ил тод нийлүүлэлтийн сүлжээ",
        supplyDesc: "Гутал бүрийн эд анги хаанаас гаралтай болохыг бүрэн харагдуулахын төлөө ажиллаж байна."
      }
    }
  }
};
if (!instance.isInitialized) {
  instance.use(initReactI18next).init({
    resources,
    lng: "mn",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    // Synchronous init so translations are ready before the first SSR render,
    // preventing a server/client hydration mismatch where the server returns
    // fallbackLng ("en") while the client renders "mn".
    initAsync: false
  });
}
function I18nProvider({ children }) {
  if (typeof window === "undefined" && instance.language !== "mn") {
    instance.changeLanguage("mn");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(I18nextProvider, { i18n: instance, children });
}
const LanguageContext = reactExports.createContext({
  language: "mn",
  setLanguage: () => {
  }
});
function LanguageProvider({ children }) {
  const [language, setLanguageState] = reactExports.useState("mn");
  reactExports.useEffect(() => {
    if (instance.language !== "mn") {
      instance.changeLanguage("mn");
    }
    const handlePopState = () => {
      const path = window.location.pathname;
      const lang = path.startsWith("/en") ? "en" : "mn";
      setLanguageState(lang);
      instance.changeLanguage(lang);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const setLanguage = (lang) => {
    setLanguageState(lang);
    instance.changeLanguage(lang);
    const currentPath = window.location.pathname;
    let newPath;
    if (lang === "mn") {
      newPath = currentPath.replace(/^\/en/, "/mn");
      if (!newPath.startsWith("/mn")) {
        newPath = "/mn" + currentPath;
      }
    } else {
      newPath = currentPath.replace(/^\/mn/, "/en");
      if (!newPath.startsWith("/en")) {
        newPath = "/en" + currentPath;
      }
    }
    window.history.pushState({}, "", newPath);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageContext.Provider, { value: { language, setLanguage }, children });
}
function useLanguage() {
  return reactExports.useContext(LanguageContext);
}
function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = reactExports.useState(false);
  const [closing, setClosing] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const menuRef = reactExports.useRef(null);
  const hamburgerRef = reactExports.useRef(null);
  const navigate = useNavigate();
  const links = [
    { to: "/", label: t("common.home") },
    { to: "/shop", label: t("common.shop") },
    { to: "/new-arrivals", label: t("common.newArrivals") },
    { to: "/contact", label: t("common.contact") }
  ];
  reactExports.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  reactExports.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);
  reactExports.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/search", search: { q } });
      setSearchOpen(false);
      setOpen(false);
    }
  };
  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 280);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 w-full bg-background/90 backdrop-blur-lg border-b border-border/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 sm:h-18 items-center justify-between gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "flex items-center gap-2.5 font-display text-xl tracking-tight shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/20 font-black text-white text-base select-none", children: "A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink font-bold hidden sm:inline", children: "AIT Shop" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-8 text-sm font-medium", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            className: "text-muted-foreground hover:text-brand transition-colors",
            activeProps: { className: "text-ink" },
            activeOptions: { exact: l.to === "/" },
            children: l.label
          },
          l.to
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 sm:gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSearchOpen((s) => !s),
              "aria-label": t("common.search"),
              className: "touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/wishlist",
              "aria-label": t("common.wishlist"),
              className: "relative touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5" }),
                wishlist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-bold grid place-items-center shadow-md", children: wishlist.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/cart",
              "aria-label": t("common.cart"),
              className: "relative touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
                cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-brand text-brand-foreground text-[10px] font-bold grid place-items-center shadow-md", children: cartCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SignedOutWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/login",
              className: "hidden md:inline-flex ml-1.5 sm:ml-2 px-4 py-2 text-sm font-semibold rounded-full border border-border hover:bg-muted active:bg-muted/80 transition",
              children: t("common.signIn")
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SignedInWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserButton, { afterSignOutUrl: "/" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setLanguage(language === "mn" ? "en" : "mn"),
              className: "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border hover:bg-muted transition",
              "aria-label": "Switch language",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
                language === "mn" ? "EN" : "МН"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              ref: hamburgerRef,
              onClick: () => setOpen((s) => !s),
              "aria-label": "Menu",
              className: "lg:hidden touch-target p-2.5 sm:p-2 rounded-full hover:bg-muted active:bg-muted/80 transition ml-0.5",
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
            }
          )
        ] })
      ] }),
      searchOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: submit, className: "pb-4 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          autoFocus: true,
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: t("common.searchPlaceholder"),
          className: "w-full h-11 px-4 rounded-full border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-brand"
        }
      ) })
    ] }),
    (open || closing) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `fixed inset-0 bg-black/40 ${closing ? "animate-fade-out" : "animate-fade-in"}`,
          onClick: close
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: menuRef,
          className: `fixed top-16 right-0 bottom-0 w-72 max-w-[85vw] bg-background border-l border-border shadow-2xl flex flex-col ${closing ? "animate-slide-out-right" : "animate-slide-in-right"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-1", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: l.to,
                onClick: close,
                className: "block px-4 py-3.5 rounded-xl hover:bg-muted text-sm font-medium transition active:bg-muted/80",
                activeProps: { className: "bg-brand/10 text-brand font-semibold" },
                activeOptions: { exact: l.to === "/" },
                children: l.label
              },
              l.to
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setLanguage(language === "mn" ? "en" : "mn"),
                  className: "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition w-full",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
                    language === "mn" ? "English" : "Монгол"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/wishlist",
                  onClick: close,
                  className: "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" }),
                    t("common.wishlist"),
                    wishlist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: wishlist.length })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/cart",
                  onClick: close,
                  className: "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
                    t("common.cart"),
                    cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: cartCount })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SignedOutWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/login",
                  onClick: close,
                  className: "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition",
                  children: t("common.signIn")
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SignedInWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserButton, { afterSignOutUrl: "/" }) }) })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function FooterSection({ title, children }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:border-0 border-b border-white/10 md:pb-0 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "md:cursor-default flex w-full items-center justify-between md:pointer-events-none py-3 md:py-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `h-4 w-4 text-white/50 md:hidden transition-transform duration-200 ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `md:block overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-3" : "max-h-0 md:max-h-96 md:mt-3"}`,
        children
      }
    )
  ] });
}
function Footer() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-16 md:mt-24 bg-ink text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid gap-8 sm:gap-10 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterSection, { title: t("common.stores"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5 text-sm text-white/70 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/find-store", className: "hover:text-white transition", children: t("common.findStore") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/newsletter", className: "hover:text-white transition", children: t("common.newsletter") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            search: { mode: "register" },
            className: "hover:text-white transition",
            children: t("common.becomeMember")
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/feedback", className: "hover:text-white transition", children: t("common.siteFeedback") }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterSection, { title: t("common.help"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5 text-sm text-white/70 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/profile",
            search: { tab: "orders" },
            className: "hover:text-white transition",
            children: t("common.orderStatus")
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shipping", className: "hover:text-white transition", children: t("common.shippingDelivery") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/returns", className: "hover:text-white transition", children: t("common.returns") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/payment-options", className: "hover:text-white transition", children: t("common.paymentOptions") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-white transition", children: t("common.contactUs") }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterSection, { title: t("common.aboutAITShop"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2.5 text-sm text-white/70 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/news", className: "hover:text-white transition", children: t("common.news") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/careers", className: "hover:text-white transition", children: t("common.careers") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/investors", className: "hover:text-white transition", children: t("common.investors") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sustainability", className: "hover:text-white transition", children: t("common.sustainability") }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterSection, { title: t("common.socials"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 pb-2", children: [Twitter, Facebook, Youtube, Instagram].map((Icon, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#",
          className: "h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-brand transition active:bg-brand",
          "aria-label": `Social ${i}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
        },
        i
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-3 justify-between text-xs text-white/50 text-center md:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " AIT Shop by AIT Nomad LLC. ",
        t("common.allRightsReserved")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-white transition", children: t("common.catalog") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-white transition", children: t("common.termsOfUse") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-white transition", children: t("common.privacy") })
      ] })
    ] }) })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-deep transition",
        children: "Go home"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong. Try again or head home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-deep",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$r = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AIT Shop — Premium Sneakers & Athletic Footwear" },
      {
        name: "description",
        content: "Discover AIT Shop — modern sneakers for running, basketball, training and everyday style."
      },
      { property: "og:title", content: "AIT Shop — Premium Sneakers & Athletic Footwear" },
      {
        property: "og:description",
        content: "Discover AIT Shop — modern sneakers for running, basketball, training and everyday style."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AIT Shop — Premium Sneakers & Athletic Footwear" },
      {
        name: "twitter:description",
        content: "Discover AIT Shop — modern sneakers for running, basketball, training and everyday style."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64e1daea-d0fd-42e3-b2c9-fa9e6573937b/id-preview-7294e352--44d45575-7524-4df7-abfa-3a2a700bfa88.lovable.app-1781093633268.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64e1daea-d0fd-42e3-b2c9-fa9e6573937b/id-preview-7294e352--44d45575-7524-4df7-abfa-3a2a700bfa88.lovable.app-1781093633268.png"
      }
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230EA5E9'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial Black,sans-serif' font-size='18' font-weight='900' fill='white'>A</text></svg>"
      },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(I18nProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] }) }) });
}
function RootComponent() {
  const { queryClient } = Route$r.useRouteContext();
  const isAdmin = useMatch({ from: "/admin", shouldThrow: false });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SafeClerkProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(StoreProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" }),
    isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col overflow-x-clip w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] })
  ] }) }) });
}
const $$splitComponentImporter$q = () => import("./wishlist-DRwwAoDa.mjs");
const Route$q = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{
      title: "Wishlist — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./sustainability-CS9HgmAH.mjs");
const Route$p = createFileRoute("/sustainability")({
  head: () => ({
    meta: [{
      title: "Sustainability — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./shop-BBUWf396.mjs");
const Route$o = createFileRoute("/shop")({
  head: () => ({
    meta: [{
      title: "Shop All Sneakers — AIT Shop"
    }, {
      name: "description",
      content: "Browse the full AIT Shop collection."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./shipping-BOCoPsr5.mjs");
const Route$n = createFileRoute("/shipping")({
  head: () => ({
    meta: [{
      title: "Shipping & Delivery — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./search-BqvCNYMU.mjs");
const Route$m = createFileRoute("/search")({
  validateSearch: objectType({
    q: stringType().optional()
  }),
  head: () => ({
    meta: [{
      title: "Search — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./sale-C-qvpUFr.mjs");
const Route$l = createFileRoute("/sale")({
  head: () => ({
    meta: [{
      title: "Sale — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./returns-BRMtXuut.mjs");
const Route$k = createFileRoute("/returns")({
  head: () => ({
    meta: [{
      title: "Returns — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./profile-D5XfO1nG.mjs");
const Route$j = createFileRoute("/profile")({
  validateSearch: objectType({
    tab: enumType(["profile", "orders", "addresses", "settings"]).optional()
  }),
  head: () => ({
    meta: [{
      title: "My account — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./payment-options-DBH5zqSX.mjs");
const Route$i = createFileRoute("/payment-options")({
  head: () => ({
    meta: [{
      title: "Payment options — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./order-success-Cxl7N3Js.mjs");
const Route$h = createFileRoute("/order-success")({
  validateSearch: objectType({
    orderId: numberType().optional()
  }),
  head: () => ({
    meta: [{
      title: "Order confirmed — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./newsletter-5Vz83Pn3.mjs");
const Route$g = createFileRoute("/newsletter")({
  head: () => ({
    meta: [{
      title: "Newsletter — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./news-CZlVhNOY.mjs");
const Route$f = createFileRoute("/news")({
  head: () => ({
    meta: [{
      title: "News — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./new-arrivals-kENr0byd.mjs");
const Route$e = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [{
      title: "New Arrivals — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./login-COZ6wuPg.mjs");
const Route$d = createFileRoute("/login")({
  validateSearch: objectType({
    mode: enumType(["login", "register"]).optional()
  }),
  head: () => ({
    meta: [{
      title: "Sign in — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./investors-zladr3_T.mjs");
const Route$c = createFileRoute("/investors")({
  head: () => ({
    meta: [{
      title: "Investors — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./find-store-MgFloNee.mjs");
const Route$b = createFileRoute("/find-store")({
  head: () => ({
    meta: [{
      title: "Find a store — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./feedback-AbhzHsD0.mjs");
const Route$a = createFileRoute("/feedback")({
  head: () => ({
    meta: [{
      title: "Site feedback — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./contact-D2FZ6pNW.mjs");
const Route$9 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact us — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./checkout-DcvF7GVz.mjs");
const Route$8 = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./categories-D3Q5nErF.mjs");
const Route$7 = createFileRoute("/categories")({
  head: () => ({
    meta: [{
      title: "Categories — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./cart-DaGPdJ4L.mjs");
const Route$6 = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Cart — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./careers-tFDSlRQn.mjs");
const Route$5 = createFileRoute("/careers")({
  head: () => ({
    meta: [{
      title: "Careers — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin-CT8NJthN.mjs");
const Route$4 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./about-9NcvA-bH.mjs");
const Route$3 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — AIT Shop"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-CGjrvHnA.mjs");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "AIT Shop — Step Into Motion"
    }, {
      name: "description",
      content: "Bold sneakers built for every stride. Shop the latest drops from AIT Shop."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./product._id-D5dbt6Uz.mjs");
const Route$1 = createFileRoute("/product/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./category._slug-C-YSCEv_.mjs");
const Route = createFileRoute("/category/$slug")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WishlistRoute = Route$q.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$r
});
const SustainabilityRoute = Route$p.update({
  id: "/sustainability",
  path: "/sustainability",
  getParentRoute: () => Route$r
});
const ShopRoute = Route$o.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => Route$r
});
const ShippingRoute = Route$n.update({
  id: "/shipping",
  path: "/shipping",
  getParentRoute: () => Route$r
});
const SearchRoute = Route$m.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$r
});
const SaleRoute = Route$l.update({
  id: "/sale",
  path: "/sale",
  getParentRoute: () => Route$r
});
const ReturnsRoute = Route$k.update({
  id: "/returns",
  path: "/returns",
  getParentRoute: () => Route$r
});
const ProfileRoute = Route$j.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$r
});
const PaymentOptionsRoute = Route$i.update({
  id: "/payment-options",
  path: "/payment-options",
  getParentRoute: () => Route$r
});
const OrderSuccessRoute = Route$h.update({
  id: "/order-success",
  path: "/order-success",
  getParentRoute: () => Route$r
});
const NewsletterRoute = Route$g.update({
  id: "/newsletter",
  path: "/newsletter",
  getParentRoute: () => Route$r
});
const NewsRoute = Route$f.update({
  id: "/news",
  path: "/news",
  getParentRoute: () => Route$r
});
const NewArrivalsRoute = Route$e.update({
  id: "/new-arrivals",
  path: "/new-arrivals",
  getParentRoute: () => Route$r
});
const LoginRoute = Route$d.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$r
});
const InvestorsRoute = Route$c.update({
  id: "/investors",
  path: "/investors",
  getParentRoute: () => Route$r
});
const FindStoreRoute = Route$b.update({
  id: "/find-store",
  path: "/find-store",
  getParentRoute: () => Route$r
});
const FeedbackRoute = Route$a.update({
  id: "/feedback",
  path: "/feedback",
  getParentRoute: () => Route$r
});
const ContactRoute = Route$9.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$r
});
const CheckoutRoute = Route$8.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$r
});
const CategoriesRoute = Route$7.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => Route$r
});
const CartRoute = Route$6.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$r
});
const CareersRoute = Route$5.update({
  id: "/careers",
  path: "/careers",
  getParentRoute: () => Route$r
});
const AdminRoute = Route$4.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$r
});
const AboutRoute = Route$3.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$r
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$r
});
const ProductIdRoute = Route$1.update({
  id: "/product/$id",
  path: "/product/$id",
  getParentRoute: () => Route$r
});
const CategorySlugRoute = Route.update({
  id: "/category/$slug",
  path: "/category/$slug",
  getParentRoute: () => Route$r
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AdminRoute,
  CareersRoute,
  CartRoute,
  CategoriesRoute,
  CheckoutRoute,
  ContactRoute,
  FeedbackRoute,
  FindStoreRoute,
  InvestorsRoute,
  LoginRoute,
  NewArrivalsRoute,
  NewsRoute,
  NewsletterRoute,
  OrderSuccessRoute,
  PaymentOptionsRoute,
  ProfileRoute,
  ReturnsRoute,
  SaleRoute,
  SearchRoute,
  ShippingRoute,
  ShopRoute,
  SustainabilityRoute,
  WishlistRoute,
  CategorySlugRoute,
  ProductIdRoute
};
const routeTree = Route$r._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1e3,
        // cache for 5 min — avoids refetch on every page visit
        gcTime: 10 * 60 * 1e3,
        // keep unused data for 10 min
        refetchOnWindowFocus: false,
        // don't refetch when tab regains focus
        retry: 1
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    // prefetch route data when user hovers a link
    defaultPreloadStaleTime: 3e4
    // treat prefetched data as fresh for 30 s
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$m as R,
  useStore as a,
  Route$j as b,
  Route$h as c,
  Route$d as d,
  categories as e,
  shoe2$1 as f,
  shoe3 as g,
  shoe4 as h,
  shoe5 as i,
  shoe2 as j,
  Route$1 as k,
  Route as l,
  products as p,
  router as r,
  shoe as s,
  useLanguage as u
};
