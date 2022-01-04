import './App.css'
import { useState, useEffect, useRef } from 'react'
import { PDFExport } from '@progress/kendo-react-pdf'

import ReactLoading from 'react-loading'
import axios from 'axios'
import Modal from 'react-modal'

import Chart from './components/Chart'

function PokeDex() {
  const contentArea = useRef()

  const [currentUrl, setCurrentUrl] = useState(
    'https://pokeapi.co/api/v2/pokemon'
  )

  const [pokemons, setPokemons] = useState([])
  const [pokemonDetail, setPokemonDetail] = useState(null)

  const [search, setSearch] = useState('')

  const [nextPage, setNextPage] = useState(null)
  const [previousPage, setPreviousPage] = useState(null)
  const [sort, setSort] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: 'black',
      color: 'white',
      width: '50%',
      minWidth: '320px',
      height: '80vh',
    },
    overlay: { backgroundColor: 'grey' },
  }

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(currentUrl)
      .then((response) => {
        setPreviousPage(response.data['previous'])
        setNextPage(response.data['next'])
        const data = response.data['results']
        return data.sort((a, b) => a.name.localeCompare(b.name))
      })
      .then((pokemons) => {
        setPokemons(pokemons)
        setIsLoading(false)
      })
  }, [currentUrl])

  const sorting = () => {
    const newPokemons = [...pokemons]
    if (sort) {
      newPokemons.sort((a, b) => (a.name > b.name ? 1 : -1))
    } else {
      newPokemons.sort((a, b) => (a.name > b.name ? -1 : 1))
    }
    setPokemons(newPokemons)
    setSort(!sort)
  }

  const Details = (url) => {
    axios.get(url).then((req) => {
      setPokemonDetail(req.data)
    })
  }

  const handleExportWithComponent = () => {
    contentArea.current.save()
  }

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className='App-header'>
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex,
              and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>
              when hover on the list item , change the item color to yellow.
            </li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>
              If you do more than expected (E.g redesign the page / create a
              chat feature at the bottom right). it would be good.
            </li>
          </ul>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header className='App-header'>
        {isLoading ? (
          <>
            <div className='App'>
              <header className='App-header'>
                <b>Implement loader here</b>
                <ReactLoading
                  type='bubbles'
                  color='white'
                  height='20%'
                  width='20%'
                />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <div className='list row'>
              <div className='col-md-8'>
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    // onKeyUp={Search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                  />
                </div>
              </div>
              <div className='col-md-8'>
                <h4>Pokedex list</h4>

                <button onClick={sorting}>Sort</button>

                <ul className='list-group'>
                  {pokemons
                    .filter((p) => p.name.includes(search))
                    .map((p, index) => (
                      <li
                        className={'list-group-item pokemon-name'}
                        onClick={() => Details(p.url)}
                        key={`key-${p.name}-${index}`}
                      >
                        {p.name}
                      </li>
                    ))}
                </ul>
              </div>
              <div className='App-buttonContainer'>
                {previousPage && (
                  <button
                    onClick={() => {
                      setCurrentUrl(previousPage)
                    }}
                  >
                    Previous
                  </button>
                )}
                {nextPage && (
                  <button
                    style={previousPage ? { marginLeft: '5.0rem' } : null}
                    onClick={() => {
                      setCurrentUrl(nextPage)
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ''}
          onRequestClose={() => {
            setPokemonDetail(null)
          }}
          style={customStyles}
        >
          {/* <div>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>
                Create a buttton to download the information generated in this
                modal as pdf. (images and chart must be included)
              </li>
            </ul>
          </div> */}
          <button onClick={handleExportWithComponent}>Download PDF</button>
          <PDFExport ref={contentArea} paperSize='A4'>
            <div className='modalContainer'>
              <img
                alt='pokemon avatar'
                width='50%'
                className='pokemon-detail-img-center'
                src={pokemonDetail.sprites.front_default}
              />
              {pokemonDetail.stats.map((stats) => (
                <div className='pokemon-detail-list'>
                  <div style={{ paddingRight: '5px' }}>{stats.stat.name}:</div>
                  <div>{stats.base_stat}</div>
                </div>
              ))}
              <Chart data={pokemonDetail.stats} />
            </div>
          </PDFExport>
        </Modal>
      )}
    </div>
  )
}

export default PokeDex
