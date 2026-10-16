import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const initialProducts = [
    { id: 1, name: 'Lucky Me! Pancit Canton', category: 'Instant noodles', price: 15, stock: 28, sold: 42, color: 'peach' },
    { id: 2, name: 'Coca-Cola 290 ml', category: 'Drinks', price: 20, stock: 8, sold: 36, color: 'mint' },
    { id: 3, name: 'Payless Instant Mami', category: 'Instant noodles', price: 12, stock: 19, sold: 31, color: 'yellow' },
    { id: 4, name: 'Surf Powder 65 g', category: 'Household', price: 9, stock: 6, sold: 27, color: 'blue' },
    { id: 5, name: 'SkyFlakes Crackers', category: 'Snacks', price: 8, stock: 34, sold: 24, color: 'pink' },
];

const initialSales = [
    { id: 'S-1048', item: 'Coca-Cola 290 ml', quantity: 2, total: 40, time: '10:42 AM', method: 'Cash' },
    { id: 'S-1047', item: 'Lucky Me! Pancit Canton', quantity: 1, total: 15, time: '10:28 AM', method: 'Cash' },
    { id: 'S-1046', item: 'Surf Powder 65 g', quantity: 3, total: 27, time: '10:11 AM', method: 'GCash' },
    { id: 'S-1045', item: 'SkyFlakes Crackers', quantity: 2, total: 16, time: '9:54 AM', method: 'Cash' },
];

const navigation = [
    { id: 'Overview', icon: 'grid' },
    { id: 'Inventory', icon: 'box' },
    { id: 'Sales', icon: 'receipt' },
    { id: 'Reports', icon: 'chart' },
];

function Icon({ name, size = 18 }) {
    const paths = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
        box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" /></>,
        receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
        chart: <><path d="M3 3v18h18" /><path d="m8 14 4-4 3 3 5-7" /></>,
        search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
        plus: <><path d="M12 5v14M5 12h14" /></>,
        arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
        close: <><path d="m18 6-12 12M6 6l12 12" /></>,
        bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
        bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    };

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[name]}
        </svg>
    );
}

function formatPeso(amount) {
    return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StoreDashboard() {
    const { auth, canLogin, canRegister } = usePage().props;
    const [activePage, setActivePage] = useState('Overview');
    const [products, setProducts] = useState(initialProducts);
    const [sales, setSales] = useState(initialSales);
    const [search, setSearch] = useState('');
    const [saleOpen, setSaleOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('1');
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [notice, setNotice] = useState('');

    const todaySales = useMemo(() => sales.reduce((total, sale) => total + sale.total, 0) + 2840, [sales]);
    const filteredProducts = products.filter((product) =>
        `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()),
    );
    const lowStock = products.filter((product) => product.stock <= 10);
    const currentProduct = products.find((product) => product.id === Number(selectedProduct));

    function recordSale(event) {
        event.preventDefault();
        const product = products.find((item) => item.id === Number(selectedProduct));
        const saleQuantity = Number(quantity);

        if (!product || saleQuantity < 1 || saleQuantity > product.stock) {
            setNotice('Please enter a quantity available in stock.');
            return;
        }

        const now = new Date();
        const sale = {
            id: `S-${1049 + sales.length - initialSales.length}`,
            item: product.name,
            quantity: saleQuantity,
            total: product.price * saleQuantity,
            time: now.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' }),
            method: paymentMethod,
        };

        setSales((current) => [sale, ...current]);
        setProducts((current) => current.map((item) =>
            item.id === product.id ? { ...item, stock: item.stock - saleQuantity, sold: item.sold + saleQuantity } : item,
        ));
        setSaleOpen(false);
        setQuantity(1);
        setNotice(`${product.name} added to today's sales.`);
        window.setTimeout(() => setNotice(''), 3200);
    }

    return (
        <>
            <Head title="Store overview" />
            <div className="store-app">
                <aside className="store-sidebar">
                    <a className="store-brand" href="/" aria-label="Sari Sari home">
                        <span className="brand-mark">s.</span>
                        <span className="brand-copy"><strong>sari-sari</strong><small>STORE MANAGER</small></span>
                    </a>

                    <div className="sidebar-label">WORKSPACE</div>
                    <nav className="store-nav" aria-label="Main navigation">
                        {navigation.map((item) => (
                            <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
                                <Icon name={item.icon} /><span>{item.id}</span>
                                {item.id === 'Inventory' && lowStock.length > 0 && <span className="nav-count">{lowStock.length}</span>}
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-bottom">
                        <div className="store-status"><span className="status-dot" /><span><strong>Store is open</strong><small>Last synced just now</small></span></div>
                        {auth?.user ? (
                            <div className="user-row">
                                <div className="user-avatar">{auth.user.name?.slice(0, 1).toUpperCase()}</div>
                                <span className="user-copy"><strong>{auth.user.name}</strong><small>Store owner</small></span>
                                <Link href={route('logout')} method="post" as="button" className="logout-button" title="Log out">↗</Link>
                            </div>
                        ) : (
                            <div className="guest-links">
                                {canLogin && <Link href={route('login')}>Log in</Link>}
                                {canRegister && <Link href={route('register')}>Create account</Link>}
                            </div>
                        )}
                    </div>
                </aside>

                <main className="store-main">
                    <header className="store-topbar">
                        <div className="breadcrumb"><span>My store</span><span className="breadcrumb-slash">/</span><strong>{activePage}</strong></div>
                        <div className="topbar-actions">
                            <span className="today-label">{new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" /><i /></button>
                            <button className="top-avatar" aria-label="Store profile">{auth?.user?.name?.slice(0, 1).toUpperCase() || 'M'}</button>
                        </div>
                    </header>

                    <div className="dashboard-content">
                        <section className="page-heading">
                            <div>
                                <p className="eyebrow">THURSDAY, OCTOBER 16</p>
                                <h1>{activePage === 'Overview' ? 'Good day, store owner' : activePage}</h1>
                                <p className="heading-subtitle">{activePage === 'Overview' ? 'Here’s what’s happening at your store today.' : `Keep your ${activePage.toLowerCase()} organized and up to date.`}</p>
                            </div>
                            <button className="primary-button" onClick={() => setSaleOpen(true)}><Icon name="plus" size={17} /> Record a sale</button>
                        </section>

                        <section className="metrics-grid" aria-label="Store performance">
                            <article className="metric-card revenue-card">
                                <div className="metric-top"><span>Sales today</span><span className="metric-icon coral-icon"><Icon name="receipt" size={17} /></span></div>
                                <strong className="metric-value">{formatPeso(todaySales)}</strong>
                                <div className="metric-foot"><span className="trend-up">↗ 12.8%</span><span>vs. yesterday</span><span className="sparkline" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span></div>
                            </article>
                            <article className="metric-card">
                                <div className="metric-top"><span>Transactions</span><span className="metric-icon green-icon"><Icon name="bag" size={17} /></span></div>
                                <strong className="metric-value">{18 + sales.length - initialSales.length}<small> sales</small></strong>
                                <div className="metric-foot"><span className="metric-note">Across all payments</span></div>
                            </article>
                            <article className="metric-card">
                                <div className="metric-top"><span>Products in stock</span><span className="metric-icon yellow-icon"><Icon name="box" size={17} /></span></div>
                                <strong className="metric-value">{products.reduce((total, product) => total + product.stock, 0)}<small> units</small></strong>
                                <div className="metric-foot"><span className="stock-warning">{lowStock.length} items running low</span></div>
                            </article>
                            <article className="metric-card">
                                <div className="metric-top"><span>Average sale</span><span className="metric-icon blue-icon"><Icon name="chart" size={17} /></span></div>
                                <strong className="metric-value">{formatPeso(Math.round(todaySales / (18 + sales.length - initialSales.length)))}</strong>
                                <div className="metric-foot"><span className="metric-note">Per transaction today</span></div>
                            </article>
                        </section>

                        <section className="overview-grid">
                            <article className="panel sales-panel">
                                <div className="panel-heading"><div><h2>Sales overview</h2><p>Your store is picking up this week</p></div><select aria-label="Sales period" className="period-select" defaultValue="This week"><option>This week</option><option>This month</option></select></div>
                                <div className="chart-summary"><strong>₱18,420</strong><span className="trend-up">↗ 8.4%</span><small>compared to last week</small></div>
                                <div className="chart-wrap" aria-label="Weekly sales bar chart">
                                    <div className="chart-y-labels"><span>₱6k</span><span>₱4k</span><span>₱2k</span><span>₱0</span></div>
                                    <div className="chart-bars">
                                        {[['Mon', 48], ['Tue', 66], ['Wed', 42], ['Thu', 81], ['Fri', 59], ['Sat', 96], ['Sun', 70]].map(([day, height], index) => (
                                            <div className="chart-column" key={day}><div className={`chart-bar ${index === 5 ? 'highlight' : ''}`} style={{ height: `${height}%` }}><span>{index === 5 ? '₱4,680' : ''}</span></div><small>{day}</small></div>
                                        ))}
                                    </div>
                                </div>
                            </article>

                            <article className="panel bestsellers-panel">
                                <div className="panel-heading"><div><h2>Best sellers</h2><p>Most loved by your suki</p></div><button className="text-button" onClick={() => setActivePage('Inventory')}>View all <Icon name="arrow" size={14} /></button></div>
                                <div className="bestseller-list">
                                    {products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4).map((product, index) => (
                                        <div className="bestseller-row" key={product.id}><span className={`product-thumb ${product.color}`}>{product.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}</span><span className="bestseller-name"><strong>{product.name}</strong><small>{product.sold} sold this week</small></span><span className="bestseller-rank">0{index + 1}</span></div>
                                    ))}
                                </div>
                            </article>
                        </section>

                        <section className="panel inventory-panel">
                            <div className="panel-heading inventory-heading"><div><h2>{activePage === 'Sales' ? 'Recent sales' : activePage === 'Reports' ? 'Sales report' : 'Inventory snapshot'}</h2><p>{activePage === 'Sales' ? 'The latest transactions from your store' : activePage === 'Reports' ? 'A quick look at your weekly performance' : 'Keep an eye on what’s on your shelves'}</p></div><div className="table-actions"><label className="search-field"><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" /></label><button className="text-button" onClick={() => setActivePage(activePage === 'Inventory' ? 'Overview' : 'Inventory')}>{activePage === 'Inventory' ? 'Back to overview' : 'Manage stock'} <Icon name="arrow" size={14} /></button></div></div>
                            <div className="table-scroll">
                                <table className="inventory-table">
                                    <thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>IN STOCK</th><th>STATUS</th><th /></tr></thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}><td><span className={`product-thumb table-thumb ${product.color}`}>{product.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}</span><strong>{product.name}</strong></td><td>{product.category}</td><td className="price-cell">{formatPeso(product.price)}</td><td>{product.stock} pcs</td><td><span className={`stock-pill ${product.stock <= 10 ? 'low' : 'healthy'}`}><i />{product.stock <= 10 ? 'Low stock' : 'In stock'}</span></td><td><button className="row-action" title={`Record sale of ${product.name}`} onClick={() => { setSelectedProduct(String(product.id)); setSaleOpen(true); }}>+</button></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredProducts.length === 0 && <p className="empty-state">No products match “{search}”.</p>}
                            </div>
                            <div className="table-footer"><span>Showing {filteredProducts.length} of {products.length} products</span><button className="table-link" onClick={() => setActivePage('Inventory')}>View inventory <Icon name="arrow" size={14} /></button></div>
                        </section>

                        <section className="bottom-grid">
                            <article className="panel recent-panel"><div className="panel-heading"><div><h2>Recent sales</h2><p>Latest transactions today</p></div><button className="text-button" onClick={() => setActivePage('Sales')}>See all <Icon name="arrow" size={14} /></button></div><div className="recent-list">{sales.slice(0, 3).map((sale) => <div className="recent-row" key={sale.id}><span className="recent-icon"><Icon name="bag" size={17} /></span><span className="recent-name"><strong>{sale.item}</strong><small>{sale.quantity} item{sale.quantity > 1 ? 's' : ''} · {sale.time}</small></span><span className="recent-amount"><strong>{formatPeso(sale.total)}</strong><small>{sale.method}</small></span></div>)}</div></article>
                            <article className="low-stock-panel"><div className="low-stock-head"><span className="warning-symbol">!</span><div><h2>Stock check</h2><p>These items are almost out</p></div></div><div className="low-stock-list">{lowStock.length > 0 ? lowStock.slice(0, 3).map((product) => <div className="low-stock-row" key={product.id}><span>{product.name}</span><strong>{product.stock} left</strong></div>) : <div className="low-stock-row"><span>Everything is well stocked</span><strong>Looking good</strong></div>}</div><button className="restock-button" onClick={() => setActivePage('Inventory')}>Review inventory <Icon name="arrow" size={14} /></button></article>
                        </section>
                        <footer className="store-footer"><span>Made for the neighborhood store.</span><span>Local demo data · Changes reset when you reload</span></footer>
                    </div>
                </main>
            </div>

            {saleOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSaleOpen(false); }}><section className="sale-modal" role="dialog" aria-modal="true" aria-labelledby="sale-title"><div className="modal-heading"><div><span className="modal-kicker">QUICK CHECKOUT</span><h2 id="sale-title">Record a sale</h2></div><button className="icon-button" onClick={() => setSaleOpen(false)} aria-label="Close"><Icon name="close" /></button></div><form onSubmit={recordSale}><label className="form-label">Product<select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)}>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {formatPeso(product.price)} ({product.stock} left)</option>)}</select></label><label className="form-label">Quantity<input type="number" min="1" max={currentProduct?.stock || 1} value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label><label className="form-label">Payment method<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option>Cash</option><option>GCash</option><option>Utang</option></select></label><div className="sale-total"><span>Total</span><strong>{formatPeso((currentProduct?.price || 0) * (Number(quantity) || 0))}</strong></div>{notice && <p className="form-notice">{notice}</p>}<button className="primary-button modal-submit" type="submit">Complete sale <Icon name="arrow" size={16} /></button></form></section></div>}
            {notice && !saleOpen && <div className="toast-message" role="status">{notice}</div>}
        </>
    );
}