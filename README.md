## Store API

This is a store api that uses advance filtering logic to filter data
using query parameters.

    /x/y?z=10&c=20

API:

- /api/v1/products?productName={VALUE}
- /api/v1/products?company={VALUE}
- /api/v1/products?rating={VALUE}
- /api/v1/products?price={VALUE}
- /api/v1/products?feature={VALUE}

#### User can mix these values like following

- /api/v1/products?feature={VALUE}&price={VALUE}

#### User can also opt to get certain fields using "fields" query param

- /api/v1/products?fields=productName,rating

or either exclude certain fields like

- /api/v1/products?fields=-productName,-rating

#### User can also opt to use numeric filter

- /api/v1/products?numericFilter=price>30000,rating<10

#### User can also opt to sort according to any field mentioned above

- /api/v1/products?sort=productName (From A to Z)
- /api/v1/products?sort=-productName (From Z to A)
