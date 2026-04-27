import Header from '../components/Header';
import ProductList from '../components/ProductList';

const NewArrivals: React.FC = () => {
  return (
    <>
      <Header />
      <ProductList filterBadge="New" sectionLabel="Fresh Finds" sectionTitle="New Arrivals" />
    </>
  );
};

export default NewArrivals;
