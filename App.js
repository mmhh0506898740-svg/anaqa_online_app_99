import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  purple: '#2A0638',
  purple2: '#4B1265',
  soft: '#F6F1F8',
  card: '#FFFFFF',
  text: '#211827',
  muted: '#7D7282',
  line: '#E9E2EB',
  accent: '#B886C6',
  success: '#257A4B',
  danger: '#B6425D',
};

const DEMO_CATEGORIES = [
  { id: 'women', title: 'نسائي', icon: 'woman-outline' },
  { id: 'men', title: 'رجالي', icon: 'man-outline' },
  { id: 'kids', title: 'أطفال', icon: 'happy-outline' },
  { id: 'shoes', title: 'أحذية', icon: 'footsteps-outline' },
  { id: 'bags', title: 'شنط', icon: 'briefcase-outline' },
  { id: 'accessories', title: 'إكسسوارات', icon: 'sparkles-outline' },
];

const DEMO_PRODUCTS = [
  { id: 'p1', name: 'فستان أنيق يومي', category: 'women', price: 120, oldPrice: 150, sizes: ['S', 'M', 'L', 'XL'], colors: ['أسود', 'موف'], image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 'p2', name: 'قميص رجالي كلاسيك', category: 'men', price: 85, oldPrice: null, sizes: ['M', 'L', 'XL'], colors: ['أبيض', 'رمادي'], image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 'p3', name: 'طقم أطفال ناعم', category: 'kids', price: 70, oldPrice: 85, sizes: ['2Y', '4Y', '6Y'], colors: ['وردي', 'أزرق'], image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 'p4', name: 'حذاء يومي مريح', category: 'shoes', price: 95, oldPrice: null, sizes: ['38', '39', '40', '41'], colors: ['أبيض', 'أسود'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 'p5', name: 'شنطة كتف صغيرة', category: 'bags', price: 110, oldPrice: 135, sizes: ['موحد'], colors: ['بيج', 'بني'], image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 'p6', name: 'طقم إكسسوارات ناعم', category: 'accessories', price: 45, oldPrice: null, sizes: ['موحد'], colors: ['ذهبي'], image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80', featured: false },
];

const ORDER_STAGES = ['تم إنشاء الطلب', 'تم تأكيد الطلب', 'جاري التجهيز', 'خرج للتوصيل', 'تم التسليم'];

function money(value) {
  return `${value.toLocaleString('ar-YE')} ر.س`;
}

function IconButton({ name, onPress, badge }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton} activeOpacity={0.8}>
      <Ionicons name={name} size={23} color={COLORS.text} />
      {badge > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
    </TouchableOpacity>
  );
}

function Header({ title, onBack, right }) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerSide}>{onBack ? <IconButton name="arrow-forward" onPress={onBack} /> : <View style={{ width: 44 }} />}</View>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSide}>{right || <View style={{ width: 44 }} />}</View>
    </View>
  );
}

function BottomNav({ current, onNavigate, cartCount }) {
  const items = [
    { id: 'home', label: 'الرئيسية', icon: 'home-outline' },
    { id: 'categories', label: 'الأقسام', icon: 'grid-outline' },
    { id: 'favorites', label: 'المفضلة', icon: 'heart-outline' },
    { id: 'orders', label: 'طلباتي', icon: 'cube-outline' },
    { id: 'account', label: 'حسابي', icon: 'person-outline' },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => onNavigate(item.id)} style={styles.navItem} activeOpacity={0.85}>
          <Ionicons name={item.icon} size={22} color={current === item.id ? COLORS.purple : COLORS.muted} />
          <Text style={[styles.navLabel, current === item.id && styles.navLabelActive]}>{item.label}</Text>
          {item.id === 'orders' && cartCount > 0 && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ProductCard({ product, onPress, favorite, onFavorite, horizontal = false }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.productCard, horizontal && { width: 190 }]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        <TouchableOpacity style={styles.heartChip} onPress={() => onFavorite(product)}>
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={18} color={favorite ? COLORS.danger : COLORS.text} />
        </TouchableOpacity>
        {product.oldPrice && <View style={styles.offerPill}><Text style={styles.offerText}>خصم</Text></View>}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{money(product.price)}</Text>
          {product.oldPrice && <Text style={styles.oldPrice}>{money(product.oldPrice)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HomeScreen({ onNavigate, onProduct, favorites, onFavorite, cartCount }) {
  const [query, setQuery] = useState('');
  const featured = DEMO_PRODUCTS.filter(p => p.featured);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Image source={require('./assets/logo.png')} style={styles.smallLogo} resizeMode="contain" />
          <IconButton name="bag-outline" onPress={() => onNavigate('cart')} badge={cartCount} />
        </View>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={COLORS.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث عن منتج أو قسم..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={19} color={COLORS.muted} /></TouchableOpacity>}
        </View>

        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroKicker}>تشكيلة الموسم</Text>
            <Text style={styles.heroTitle}>أناقة تبدأ من اختيارك</Text>
            <Text style={styles.heroSub}>منتجات جديدة، خيارات متنوعة، وتجربة شراء سهلة.</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => onNavigate('categories')}>
              <Text style={styles.heroButtonText}>تسوّق الآن</Text>
              <Ionicons name="arrow-back" size={17} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroArt}>
            <Ionicons name="shirt-outline" size={78} color="#fff" />
            <Ionicons name="sparkles" size={22} color="#fff" style={{ position: 'absolute', top: 10, right: 4 }} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الأقسام</Text>
          <TouchableOpacity onPress={() => onNavigate('categories')}><Text style={styles.linkText}>عرض الكل</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPad}>
          {DEMO_CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => onNavigate('category', { categoryId: cat.id })}>
              <View style={styles.categoryCircle}><Ionicons name={cat.icon} size={28} color={COLORS.purple} /></View>
              <Text style={styles.categoryText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.deliveryStrip}>
          <View style={styles.deliveryIcon}><Ionicons name="car-outline" size={24} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryTitle}>توصيل للباب</Text>
            <Text style={styles.deliveryText}>خيارات توصيل مرنة وسيتم تأكيد الطلب قبل الشحن</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>منتجات مختارة</Text><Text style={styles.mutedSmall}>تجريبية</Text></View>
        {query ? (
          <View style={{ marginBottom: 12 }}>
            {DEMO_PRODUCTS.filter(p => `${p.name} ${p.category}`.includes(query)).map(p => (
              <ProductCard key={p.id} product={p} onPress={() => onProduct(p)} favorite={favorites.includes(p.id)} onFavorite={onFavorite} />
            ))}
            {DEMO_PRODUCTS.filter(p => `${p.name} ${p.category}`.includes(query)).length === 0 && <Text style={styles.emptyInline}>لا توجد نتائج في البيانات التجريبية.</Text>}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPad}>
            {featured.map((product) => <ProductCard key={product.id} product={product} horizontal onPress={() => onProduct(product)} favorite={favorites.includes(product.id)} onFavorite={onFavorite} />)}
          </ScrollView>
        )}

        <View style={styles.infoGrid}>
          {[
            ['shield-checkmark-outline', 'دفع آمن', 'تجربة دفع واضحة'],
            ['refresh-outline', 'استبدال', 'حسب سياسة المتجر'],
            ['headset-outline', 'دعم', 'تواصل عند الحاجة'],
          ].map(([icon, title, sub]) => (
            <View key={title} style={styles.infoCard}>
              <Ionicons name={icon} size={24} color={COLORS.purple} />
              <Text style={styles.infoTitle}>{title}</Text>
              <Text style={styles.infoSub}>{sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav current="home" onNavigate={onNavigate} cartCount={cartCount} />
    </SafeAreaView>
  );
}

function CategoriesScreen({ onNavigate, cartCount }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
        <Header title="الأقسام" right={<IconButton name="bag-outline" onPress={() => onNavigate('cart')} badge={cartCount} />} />
        <Text style={styles.pageSub}>اختر القسم لاستعراض المنتجات.</Text>
        <View style={styles.categoryGrid}>
          {DEMO_CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} onPress={() => onNavigate('category', { categoryId: cat.id })}>
              <View style={styles.categoryBigIcon}><Ionicons name={cat.icon} size={38} color={COLORS.purple} /></View>
              <Text style={styles.categoryCardTitle}>{cat.title}</Text>
              <Text style={styles.categoryCardSub}>{DEMO_PRODUCTS.filter(p => p.category === cat.id).length} منتج تجريبي</Text>
              <Ionicons name="arrow-back" size={17} color={COLORS.muted} style={{ marginTop: 10 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav current="categories" onNavigate={onNavigate} cartCount={cartCount} />
    </SafeAreaView>
  );
}

function CategoryScreen({ categoryId, onBack, onProduct, favorites, onFavorite }) {
  const cat = DEMO_CATEGORIES.find(c => c.id === categoryId);
  const products = DEMO_PRODUCTS.filter(p => p.category === categoryId);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <Header title={cat?.title || 'القسم'} onBack={onBack} />
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridList}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}><ProductCard product={item} onPress={() => onProduct(item)} favorite={favorites.includes(item.id)} onFavorite={onFavorite} /></View>
          )}
          ListEmptyComponent={<View style={styles.emptyBox}><Ionicons name="file-tray-outline" size={42} color={COLORS.muted} /><Text style={styles.emptyTitle}>القسم جاهز للمنتجات</Text><Text style={styles.emptyText}>ستتم إضافة المنتجات الحقيقية لاحقًا.</Text></View>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

function ProductScreen({ product, onBack, onAdd, favorite, onFavorite }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
        <Header title="تفاصيل المنتج" onBack={onBack} />
        <View style={styles.detailImageWrap}>
          <Image source={{ uri: product.image }} style={styles.detailImage} resizeMode="cover" />
          <TouchableOpacity style={styles.detailHeart} onPress={() => onFavorite(product)}><Ionicons name={favorite ? 'heart' : 'heart-outline'} size={22} color={favorite ? COLORS.danger : COLORS.text} /></TouchableOpacity>
        </View>
        <View style={styles.detailTitleRow}>
          <View style={{ flex: 1 }}><Text style={styles.detailName}>{product.name}</Text><Text style={styles.mutedSmall}>منتج تجريبي — سيتم استبدال البيانات</Text></View>
          <Text style={styles.detailPrice}>{money(product.price)}</Text>
        </View>
        <Text style={styles.detailDescription}>منتج تجريبي لعرض شكل صفحة تفاصيل المنتج. هنا ستظهر وصف المنتج الحقيقي، الخامة، تعليمات العناية، والمعلومات التي يتم إدخالها من لوحة التحكم.</Text>

        <Option title="المقاس" values={product.sizes} selected={size} setSelected={setSize} />
        <Option title="اللون" values={product.colors} selected={color} setSelected={setColor} />

        <View style={styles.qtyRow}>
          <Text style={styles.optionTitle}>الكمية</Text>
          <View style={styles.qtyControl}>
            <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}><Ionicons name="remove" size={18} color={COLORS.text} /></TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty(q => q + 1)} style={styles.qtyBtn}><Ionicons name="add" size={18} color={COLORS.text} /></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => onAdd({ product, size, color, qty })} activeOpacity={0.9}>
          <Ionicons name="bag-add-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>إضافة إلى السلة</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Option({ title, values, selected, setSelected }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text style={styles.optionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 8 }}>
        {values.map(v => (
          <TouchableOpacity key={v} onPress={() => setSelected(v)} style={[styles.optionPill, selected === v && styles.optionPillActive]}>
            <Text style={[styles.optionPillText, selected === v && styles.optionPillTextActive]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function CartScreen({ cart, onBack, onQty, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
        <Header title="السلة" onBack={onBack} />
        {cart.length === 0 ? (
          <View style={styles.emptyBox}><Ionicons name="bag-handle-outline" size={50} color={COLORS.muted} /><Text style={styles.emptyTitle}>السلة فارغة</Text><Text style={styles.emptyText}>أضف المنتجات التي ترغب بها من المتجر.</Text></View>
        ) : (
          <>
            {cart.map((item, index) => (
              <View key={`${item.product.id}-${item.size}-${item.color}-${index}`} style={styles.cartItem}>
                <Image source={{ uri: item.product.image }} style={styles.cartImage} />
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={styles.cartName}>{item.product.name}</Text>
                  <Text style={styles.mutedSmall}>المقاس: {item.size} • اللون: {item.color}</Text>
                  <Text style={styles.price}>{money(item.product.price)}</Text>
                  <View style={styles.cartBottomRow}>
                    <View style={styles.qtyControlSmall}>
                      <TouchableOpacity onPress={() => onQty(index, Math.max(1, item.qty - 1))} style={styles.qtyBtnSmall}><Ionicons name="remove" size={16} /></TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.qty}</Text>
                      <TouchableOpacity onPress={() => onQty(index, item.qty + 1)} style={styles.qtyBtnSmall}><Ionicons name="add" size={16} /></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => onRemove(index)}><Text style={styles.removeText}>حذف</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.summaryCard}>
              <SummaryRow label="الإجمالي الفرعي" value={money(total)} />
              <SummaryRow label="التوصيل" value="يحدد حسب العنوان" />
              <View style={styles.summaryLine} />
              <SummaryRow label="الإجمالي" value={money(total)} bold />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={onCheckout}><Text style={styles.primaryButtonText}>متابعة إلى إتمام الطلب</Text><Ionicons name="arrow-back" size={18} color="#fff" /></TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, bold }) { return <View style={styles.summaryRow}><Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text><Text style={[styles.summaryValue, bold && styles.summaryBold]}>{value}</Text></View>; }

function CheckoutScreen({ cart, onBack, onOrderCreated }) {
  const [form, setForm] = useState({ name: '', phone: '', governorate: '', address: '', payment: 'عند الاستلام' });
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.governorate.trim() || !form.address.trim()) {
      Alert.alert('بيانات ناقصة', 'أكمل الاسم والهاتف والمحافظة والعنوان أولًا.');
      return;
    }
    onOrderCreated({ id: `AO-${Date.now().toString().slice(-6)}`, ...form, total, items: cart, statusIndex: 1, date: new Date().toLocaleDateString('ar-YE') });
  };
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
        <Header title="إتمام الطلب" onBack={onBack} />
        <Text style={styles.formSectionTitle}>بيانات العميل</Text>
        <Field label="الاسم" value={form.name} setValue={v => setForm({ ...form, name: v })} placeholder="اكتب الاسم الكامل" />
        <Field label="رقم الهاتف" value={form.phone} setValue={v => setForm({ ...form, phone: v })} placeholder="05xxxxxxxx" keyboardType="phone-pad" />
        <Field label="المحافظة" value={form.governorate} setValue={v => setForm({ ...form, governorate: v })} placeholder="اكتب المحافظة" />
        <Field label="العنوان" value={form.address} setValue={v => setForm({ ...form, address: v })} placeholder="الحي، الشارع، وصف مختصر" multiline />
        <Text style={styles.formSectionTitle}>طريقة الدفع</Text>
        <View style={styles.paymentCard}><Ionicons name="cash-outline" size={23} color={COLORS.purple} /><View style={{ flex: 1, marginHorizontal: 10 }}><Text style={styles.paymentTitle}>الدفع عند الاستلام</Text><Text style={styles.mutedSmall}>يمكن إضافة وسائل دفع إلكترونية لاحقًا.</Text></View><Ionicons name="checkmark-circle" size={23} color={COLORS.purple} /></View>
        <View style={styles.summaryCard}><SummaryRow label="الإجمالي" value={money(total)} bold /></View>
        <TouchableOpacity style={styles.primaryButton} onPress={submit}><Text style={styles.primaryButtonText}>تأكيد الطلب</Text><Ionicons name="checkmark" size={19} color="#fff" /></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, setValue, placeholder, keyboardType, multiline }) {
  return <View style={styles.fieldWrap}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={COLORS.muted} keyboardType={keyboardType} multiline={multiline} style={[styles.field, multiline && { height: 90, textAlignVertical: 'top' }]} /></View>;
}

function SuccessScreen({ order, onDone, onOrders }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.centerScreen}>
        <View style={styles.successCircle}><Ionicons name="checkmark" size={52} color="#fff" /></View>
        <Text style={styles.successTitle}>تم استلام طلبك</Text>
        <Text style={styles.successText}>رقم الطلب: {order.id}</Text>
        <Text style={styles.successText}>الإجمالي: {money(order.total)}</Text>
        <View style={styles.successActions}><TouchableOpacity style={styles.primaryButton} onPress={onOrders}><Text style={styles.primaryButtonText}>متابعة الطلب</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButton} onPress={onDone}><Text style={styles.secondaryButtonText}>العودة للرئيسية</Text></TouchableOpacity></View>
      </View>
    </SafeAreaView>
  );
}

function OrdersScreen({ orders, onNavigate, cartCount }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollPad} showsVerticalScrollIndicator={false}>
        <Header title="طلباتي" right={<IconButton name="bag-outline" onPress={() => onNavigate('cart')} badge={cartCount} />} />
        {orders.length === 0 ? <View style={styles.emptyBox}><Ionicons name="cube-outline" size={48} color={COLORS.muted} /><Text style={styles.emptyTitle}>لا توجد طلبات بعد</Text><Text style={styles.emptyText}>ستظهر الطلبات هنا بعد إتمام أول عملية شراء.</Text></View> : orders.map(order => <OrderCard key={order.id} order={order} />)}
      </ScrollView>
      <BottomNav current="orders" onNavigate={onNavigate} cartCount={cartCount} />
    </SafeAreaView>
  );
}

function OrderCard({ order }) {
  const stages = Math.max(0, Math.min(order.statusIndex, ORDER_STAGES.length - 1));
  return <View style={styles.orderCard}><View style={styles.orderTop}><Text style={styles.orderId}>{order.id}</Text><Text style={styles.orderDate}>{order.date}</Text></View><Text style={styles.orderAmount}>{money(order.total)}</Text><View style={styles.timeline}>{ORDER_STAGES.map((stage, index) => <View key={stage} style={styles.timelineItem}><View style={[styles.timelineDot, index <= stages && styles.timelineDotActive]} />{index < ORDER_STAGES.length - 1 && <View style={[styles.timelineLine, index < stages && styles.timelineLineActive]} />}<Text style={[styles.timelineText, index === stages && styles.timelineTextActive]}>{stage}</Text></View>)}</View></View>;
}

function FavoritesScreen({ favorites, onNavigate, onProduct, onFavorite, cartCount }) {
  const items = DEMO_PRODUCTS.filter(p => favorites.includes(p.id));
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" /><View style={{ flex: 1 }}><ScrollView contentContainerStyle={styles.scrollPad}><Header title="المفضلة" right={<IconButton name="bag-outline" onPress={() => onNavigate('cart')} badge={cartCount} />} />{items.length === 0 ? <View style={styles.emptyBox}><Ionicons name="heart-outline" size={48} color={COLORS.muted} /><Text style={styles.emptyTitle}>لا توجد منتجات محفوظة</Text><Text style={styles.emptyText}>اضغط على القلب في أي منتج لحفظه هنا.</Text></View> : <View style={styles.favoriteList}>{items.map(p => <ProductCard key={p.id} product={p} onPress={() => onProduct(p)} favorite onFavorite={onFavorite} />)}</View>}</ScrollView></View><BottomNav current="favorites" onNavigate={onNavigate} cartCount={cartCount} /></SafeAreaView>;
}

function AccountScreen({ onNavigate }) {
  const [modal, setModal] = useState(null);
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" /><ScrollView contentContainerStyle={styles.scrollPad}><Header title="حسابي" /><View style={styles.accountHero}><View style={styles.avatar}><Ionicons name="person" size={30} color="#fff" /></View><View><Text style={styles.accountName}>مرحبًا بك</Text><Text style={styles.mutedSmall}>يمكنك إضافة بياناتك لاحقًا</Text></View></View><View style={styles.menuCard}>{[['orders', 'cube-outline', 'طلباتي'], ['favorites', 'heart-outline', 'المفضلة'], ['notifications', 'notifications-outline', 'الإشعارات'], ['help', 'help-circle-outline', 'المساعدة'], ['settings', 'settings-outline', 'الإعدادات']].map(([id, icon, label]) => <TouchableOpacity key={id} style={styles.menuItem} onPress={() => id === 'orders' || id === 'favorites' ? onNavigate(id) : setModal(id)}><Ionicons name={icon} size={22} color={COLORS.purple} /><Text style={styles.menuLabel}>{label}</Text><Ionicons name="chevron-back" size={18} color={COLORS.muted} /></TouchableOpacity>)}</View><View style={styles.devNote}><Text style={styles.devTitle}>مرحلة التجهيز الحالية</Text><Text style={styles.devText}>الواجهة والرحلات الأساسية جاهزة، والمنتجات والدفع وقاعدة البيانات يمكن ربطها بعد اعتماد الشكل النهائي.</Text></View></ScrollView><BottomNav current="account" onNavigate={onNavigate} cartCount={0} /><SimpleModal visible={!!modal} type={modal} onClose={() => setModal(null)} /></SafeAreaView>;
}

function SimpleModal({ visible, type, onClose }) {
  const data = type === 'notifications' ? ['لا توجد إشعارات جديدة حاليًا.'] : type === 'help' ? ['لإضافة وسائل التواصل، يتم إدخال الهاتف والواتساب والبريد لاحقًا.'] : ['إعدادات الحساب واللغة والإشعارات يمكن استكمالها في النسخة النهائية.'];
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}><Pressable style={styles.modalBackdrop} onPress={onClose}><Pressable style={styles.modalCard} onPress={() => {}}><Text style={styles.modalTitle}>{type === 'notifications' ? 'الإشعارات' : type === 'help' ? 'المساعدة' : 'الإعدادات'}</Text>{data.map((x, i) => <Text key={i} style={styles.modalText}>{x}</Text>)}<TouchableOpacity style={styles.primaryButton} onPress={onClose}><Text style={styles.primaryButtonText}>إغلاق</Text></TouchableOpacity></Pressable></Pressable></Modal>;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [params, setParams] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [successOrder, setSuccessOrder] = useState(null);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const navigate = (next, nextParams = {}) => {
    if (next === 'cart') return setScreen('cart');
    if (next === 'home' || next === 'categories' || next === 'favorites' || next === 'orders' || next === 'account') { setScreen(next); setParams({}); return; }
    setScreen(next); setParams(nextParams);
  };

  const toggleFavorite = (product) => setFavorites(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]);
  const addToCart = (entry) => {
    setCart(prev => [...prev, entry]);
    Alert.alert('تمت الإضافة', 'تمت إضافة المنتج إلى السلة.');
  };
  const createOrder = (order) => {
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setSuccessOrder(order);
    setScreen('success');
  };

  if (screen === 'home') return <HomeScreen onNavigate={navigate} onProduct={(p) => navigate('product', { product: p })} favorites={favorites} onFavorite={toggleFavorite} cartCount={cartCount} />;
  if (screen === 'categories') return <CategoriesScreen onNavigate={navigate} cartCount={cartCount} />;
  if (screen === 'category') return <CategoryScreen categoryId={params.categoryId} onBack={() => navigate('categories')} onProduct={(p) => navigate('product', { product: p })} favorites={favorites} onFavorite={toggleFavorite} />;
  if (screen === 'product') return <ProductScreen product={params.product} onBack={() => navigate('home')} onAdd={addToCart} favorite={favorites.includes(params.product.id)} onFavorite={toggleFavorite} />;
  if (screen === 'cart') return <CartScreen cart={cart} onBack={() => navigate('home')} onQty={(i,q) => setCart(prev => prev.map((x,idx)=>idx===i?{...x,qty:q}:x))} onRemove={(i)=>setCart(prev=>prev.filter((_,idx)=>idx!==i))} onCheckout={() => setScreen('checkout')} />;
  if (screen === 'checkout') return <CheckoutScreen cart={cart} onBack={() => navigate('cart')} onOrderCreated={createOrder} />;
  if (screen === 'success') return <SuccessScreen order={successOrder} onDone={() => navigate('home')} onOrders={() => navigate('orders')} />;
  if (screen === 'orders') return <OrdersScreen orders={orders} onNavigate={navigate} cartCount={cartCount} />;
  if (screen === 'favorites') return <FavoritesScreen favorites={favorites} onNavigate={navigate} onProduct={(p)=>navigate('product',{product:p})} onFavorite={toggleFavorite} cartCount={cartCount} />;
  if (screen === 'account') return <AccountScreen onNavigate={navigate} />;
  return <HomeScreen onNavigate={navigate} onProduct={(p) => navigate('product', { product: p })} favorites={favorites} onFavorite={toggleFavorite} cartCount={cartCount} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.soft },
  scrollPad: { padding: 16, paddingBottom: 110 },
  horizontalPad: { paddingHorizontal: 2, gap: 12 },
  homeHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  smallLogo: { width: 150, height: 62, borderRadius: 14 },
  iconButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -3, left: -3, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  searchRow: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, height: 52, borderRadius: 17, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  searchInput: { flex: 1, color: COLORS.text, textAlign: 'right', fontSize: 14, ...(Platform.OS === 'android' ? { paddingVertical: 0 } : {}) },
  heroCard: { marginTop: 14, backgroundColor: COLORS.purple, borderRadius: 26, padding: 18, flexDirection: 'row-reverse', alignItems: 'center', overflow: 'hidden' },
  heroKicker: { color: '#D8C4DE', fontSize: 12, marginBottom: 4, textAlign: 'right' },
  heroTitle: { color: '#fff', fontWeight: '900', fontSize: 23, lineHeight: 29, textAlign: 'right' },
  heroSub: { color: '#E5D5EA', marginTop: 7, fontSize: 12, lineHeight: 19, textAlign: 'right', maxWidth: 250 },
  heroButton: { marginTop: 13, alignSelf: 'flex-end', flexDirection: 'row-reverse', alignItems: 'center', gap: 7, backgroundColor: COLORS.purple2, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  heroButtonText: { color: '#fff', fontWeight: '800' },
  heroArt: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  sectionHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, textAlign: 'right' },
  linkText: { color: COLORS.purple, fontWeight: '800', fontSize: 13 },
  mutedSmall: { color: COLORS.muted, fontSize: 11, textAlign: 'right' },
  categoryItem: { width: 72, alignItems: 'center' },
  categoryCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  categoryText: { marginTop: 6, fontSize: 11, color: COLORS.text, fontWeight: '700' },
  deliveryStrip: { marginTop: 18, backgroundColor: '#EDE3F0', padding: 12, borderRadius: 18, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  deliveryIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.purple, alignItems: 'center', justifyContent: 'center' },
  deliveryTitle: { fontWeight: '900', color: COLORS.text, textAlign: 'right' },
  deliveryText: { fontSize: 11, color: COLORS.muted, marginTop: 2, textAlign: 'right' },
  productCard: { backgroundColor: COLORS.card, borderRadius: 19, overflow: 'hidden', marginBottom: 12, flex: 1, borderWidth: 1, borderColor: COLORS.line },
  imageWrap: { height: 200, backgroundColor: '#E9DFEC', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  heartChip: { position: 'absolute', top: 10, left: 10, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  offerPill: { position: 'absolute', top: 10, right: 10, backgroundColor: COLORS.danger, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 },
  offerText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, fontWeight: '800', color: COLORS.text, textAlign: 'right' },
  priceRow: { flexDirection: 'row-reverse', alignItems: 'baseline', gap: 7, marginTop: 6 },
  price: { fontSize: 14, fontWeight: '900', color: COLORS.purple, textAlign: 'right' },
  oldPrice: { fontSize: 10, color: COLORS.muted, textDecorationLine: 'line-through' },
  infoGrid: { flexDirection: 'row-reverse', gap: 9, marginTop: 8 },
  infoCard: { flex: 1, backgroundColor: COLORS.card, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line },
  infoTitle: { marginTop: 6, color: COLORS.text, fontWeight: '900', fontSize: 11, textAlign: 'right' },
  infoSub: { marginTop: 2, color: COLORS.muted, fontSize: 9, lineHeight: 13, textAlign: 'right' },
  bottomNav: { position: 'absolute', left: 10, right: 10, bottom: 9, height: 72, backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: 23, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row-reverse', paddingHorizontal: 7, alignItems: 'center', justifyContent: 'space-around', elevation: 5 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1, height: 62 },
  navLabel: { marginTop: 3, fontSize: 10, color: COLORS.muted, fontWeight: '700' },
  navLabelActive: { color: COLORS.purple, fontWeight: '900' },
  navDot: { position: 'absolute', top: 9, right: 16, width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.danger },
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  headerTitle: { flex: 1, textAlign: 'center', color: COLORS.text, fontSize: 18, fontWeight: '900' },
  headerSide: { width: 44, alignItems: 'center' },
  pageSub: { color: COLORS.muted, fontSize: 12, textAlign: 'right', marginBottom: 12 },
  categoryGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, padding: 15, minHeight: 170, alignItems: 'center' },
  categoryBigIcon: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#F0E8F2', alignItems: 'center', justifyContent: 'center' },
  categoryCardTitle: { marginTop: 12, color: COLORS.text, fontSize: 15, fontWeight: '900' },
  categoryCardSub: { marginTop: 5, color: COLORS.muted, fontSize: 10 },
  gridList: { padding: 16, paddingBottom: 24 },
  emptyBox: { marginTop: 50, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, borderRadius: 22, padding: 28, alignItems: 'center' },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: '900', color: COLORS.text },
  emptyText: { marginTop: 7, fontSize: 12, color: COLORS.muted, textAlign: 'center', lineHeight: 19 },
  emptyInline: { padding: 20, textAlign: 'center', color: COLORS.muted },
  detailImageWrap: { height: 430, backgroundColor: '#E9DFEC', borderRadius: 24, overflow: 'hidden', position: 'relative' },
  detailImage: { width: '100%', height: '100%' },
  detailHeart: { position: 'absolute', top: 14, left: 14, width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  detailTitleRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', marginTop: 16, gap: 14 },
  detailName: { color: COLORS.text, fontSize: 22, fontWeight: '900', textAlign: 'right' },
  detailPrice: { color: COLORS.purple, fontSize: 18, fontWeight: '900' },
  detailDescription: { color: COLORS.muted, fontSize: 12, lineHeight: 20, textAlign: 'right', marginTop: 12 },
  optionTitle: { color: COLORS.text, fontWeight: '900', textAlign: 'right' },
  optionPill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.card },
  optionPillActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  optionPillText: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  optionPillTextActive: { color: '#fff' },
  qtyRow: { marginTop: 18, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, padding: 5 },
  qtyBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.soft, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { minWidth: 20, textAlign: 'center', color: COLORS.text, fontWeight: '900' },
  primaryButton: { marginTop: 18, minHeight: 52, borderRadius: 16, backgroundColor: COLORS.purple, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18 },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  secondaryButton: { marginTop: 10, minHeight: 52, borderRadius: 16, borderWidth: 1, borderColor: COLORS.purple, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  secondaryButtonText: { color: COLORS.purple, fontSize: 14, fontWeight: '900' },
  cartItem: { backgroundColor: COLORS.card, borderRadius: 19, borderWidth: 1, borderColor: COLORS.line, padding: 10, marginBottom: 10, flexDirection: 'row-reverse' },
  cartImage: { width: 104, height: 120, borderRadius: 15 },
  cartName: { color: COLORS.text, fontSize: 14, fontWeight: '900', textAlign: 'right', marginBottom: 5 },
  cartBottomRow: { marginTop: 10, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  qtyControlSmall: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.soft, borderRadius: 12, padding: 4 },
  qtyBtnSmall: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  removeText: { color: COLORS.danger, fontWeight: '800', fontSize: 12 },
  summaryCard: { backgroundColor: COLORS.card, borderRadius: 19, borderWidth: 1, borderColor: COLORS.line, padding: 15, marginTop: 10 },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { color: COLORS.muted, fontSize: 12 },
  summaryValue: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  summaryBold: { color: COLORS.text, fontSize: 15, fontWeight: '900' },
  summaryLine: { height: 1, backgroundColor: COLORS.line, marginBottom: 12 },
  formSectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginTop: 4, marginBottom: 12, textAlign: 'right' },
  fieldWrap: { marginBottom: 13 },
  fieldLabel: { color: COLORS.text, fontWeight: '800', fontSize: 12, textAlign: 'right', marginBottom: 7 },
  field: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, borderRadius: 15, minHeight: 48, paddingHorizontal: 13, color: COLORS.text, textAlign: 'right' },
  paymentCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 14, flexDirection: 'row-reverse', alignItems: 'center' },
  paymentTitle: { color: COLORS.text, fontWeight: '900', textAlign: 'right', marginBottom: 3 },
  centerScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  successCircle: { width: 92, height: 92, borderRadius: 46, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center' },
  successTitle: { marginTop: 20, fontSize: 24, color: COLORS.text, fontWeight: '900' },
  successText: { marginTop: 7, color: COLORS.muted, fontSize: 13 },
  successActions: { width: '100%', marginTop: 20 },
  orderCard: { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, padding: 15, marginBottom: 12 },
  orderTop: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  orderId: { color: COLORS.purple, fontWeight: '900' },
  orderDate: { color: COLORS.muted, fontSize: 11 },
  orderAmount: { marginTop: 8, color: COLORS.text, fontWeight: '900', textAlign: 'right', fontSize: 16 },
  timeline: { marginTop: 16 },
  timelineItem: { minHeight: 38, position: 'relative', paddingRight: 30 },
  timelineDot: { position: 'absolute', right: 0, top: 4, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: COLORS.line, backgroundColor: COLORS.card },
  timelineDotActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  timelineLine: { position: 'absolute', right: 6, top: 18, width: 2, height: 28, backgroundColor: COLORS.line },
  timelineLineActive: { backgroundColor: COLORS.purple },
  timelineText: { color: COLORS.muted, fontSize: 11, textAlign: 'right' },
  timelineTextActive: { color: COLORS.purple, fontWeight: '900' },
  favoriteList: { gap: 10 },
  accountHero: { backgroundColor: COLORS.purple, borderRadius: 24, padding: 18, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginBottom: 13 },
  avatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.17)', alignItems: 'center', justifyContent: 'center' },
  accountName: { color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'right' },
  menuCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, overflow: 'hidden' },
  menuItem: { minHeight: 58, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.line, gap: 10 },
  menuLabel: { flex: 1, color: COLORS.text, fontWeight: '800', textAlign: 'right' },
  devNote: { marginTop: 14, backgroundColor: '#EDE3F0', borderRadius: 18, padding: 14 },
  devTitle: { color: COLORS.text, fontWeight: '900', textAlign: 'right' },
  devText: { color: COLORS.muted, fontSize: 11, lineHeight: 18, marginTop: 5, textAlign: 'right' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 30 },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: '900', textAlign: 'right', marginBottom: 12 },
  modalText: { color: COLORS.muted, fontSize: 13, lineHeight: 21, textAlign: 'right', marginBottom: 18 },
});
