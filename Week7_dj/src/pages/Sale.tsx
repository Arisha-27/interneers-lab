import Header from '../components/Header';
import ProductList from '../components/ProductList';

const Sale: React.FC = () => {
  return (
    <>
      <Header />
      <ProductList filterBadge="Sale" sectionLabel="Discounted Items" sectionTitle="Sale" />
    </>
  );
};

export default Sale;
