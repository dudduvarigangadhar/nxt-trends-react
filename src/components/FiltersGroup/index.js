import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const changeSearchInput = event => {
    const {onChangeSearch} = props
    onChangeSearch(event.target.value)
  }

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeRating = ratingId => {
    const {changeRating} = props
    changeRating(ratingId)
  }

  const categoryRender = () => {
    const {categoryOptions, changeCategoryId} = props
    return categoryOptions.map(eachItem => {
      const onChangeCategory = () => changeCategoryId(eachItem.name)

      return (
        <li
          key={eachItem.categoryId}
          className="category-container"
          onClick={onChangeCategory}
        >
          <p>{eachItem.name}</p>
        </li>
      )
    })
  }

  const ratingsRender = () => {
    const {ratingsList} = props
    return (
      <ul>
        <h1 className="content-type-heading">Ratings</h1>
        {ratingsList.map(eachItem => (
          <li
            key={eachItem.ratingId}
            className="ratings-container"
            onClick={onChangeRating}
          >
            <img src={eachItem.imageUrl} alt="rating" className="rating-img" />
            <p className="above-rating"> & up</p>
          </li>
        ))}
      </ul>
    )
  }

  const searchInput = () => (
    <div className="search-input-container">
      <input
        type="search"
        className="search-input-field"
        placeholder="search"
        onChange={changeSearchInput}
        onKeyDown={onEnterSearchInput}
      />
      <BsSearch />
    </div>
  )

  const onClearFilters = () => {}

  return (
    <div className="filters-group-container">
      {searchInput()}
      {categoryRender()}
      {ratingsRender()}
      <button
        className="clear-filters-btn"
        type="button"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
