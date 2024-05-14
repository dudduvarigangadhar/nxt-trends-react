import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiConstantsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'IS_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    // isLoading: false,
    apiStatus: apiConstantsStatus.initial,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  onChangeSearch = searchValue => {
    this.setState({searchInput: searchValue})
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      //   isLoading: true,
      apiStatus: apiConstantsStatus.isProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, category, rating, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${searchInput}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        // isLoading: false,
        apiStatus: apiConstantsStatus.success,
      })
    } else {
      this.setState({apiStatus: apiConstantsStatus.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeCategoryId = categoryDetails => {
    this.setState({category: categoryDetails}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure-view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="failure-content">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderViewsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstantsStatus.success:
        return this.renderProductsList()
      case apiConstantsStatus.failure:
        return this.renderFailure()
      case apiConstantsStatus.isProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  changeRating = ratingId => {
    this.setState({rating: ratingId})
  }

  render() {
    const {searchInput} = this.state
    console.log(searchInput)
    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onChangeSearch={this.onChangeSearch}
          enterSearchInput={this.enterSearchInput}
          changeCategoryId={this.changeCategoryId}
          changeRating={this.changeRating}
        />

        {this.renderViewsList()}
      </div>
    )
  }
}

export default AllProductsSection
