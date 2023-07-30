<template>
  <div class="container pt-4 position-relative" @click="logTargetElement">
    <form action="" class="row col-10 col-lg-6 m-auto">
        <div class="bg-success input-group p-0 mb-0 m-auto rounded-circle">
        <input type="text" class="form-control" placeholder="Enter Movies" aria-label="Username"
          aria-describedby="basic-addon1" v-model="movieTarget">
          <span class="input-group-text p-2 fs-4 cur-pointer btn-search" id="basic-addon1" @click="filteredData()">
            <i class="fa-solid fa-magnifying-glass p-1"></i>
          </span>
        </div>
      </form>
        <!-- <ul class="list-group list-search col-10 col-lg-6 m-auto mt-1 position-absolute" v-if="filteredData.length && movieTarget">
          <li class="list-group-item list-group-item-action cur-pointer d-flex justify-content-between align-items-center" v-for="movie, index in filteredData" :key="index" @click="showMoviesInPage(movie.id)">
            <p class="w-auto">{{ movie.title }}</p>
            <img :src="getPosterMovieUrl(movie.path)" class="img-search p-0" :alt="movie.title" loading="lazy">
          </li>
        </ul>
        <ul class="list-group list-search col-10 col-lg-6 m-auto mt-1 position-absolute" v-else-if="!filteredData.length">
          <li class="list-group-item p-3">not found movie</li>
        </ul> -->
    <div class="movies mt-5 row g-4 justify-content-center justify-content-sm-center">
      <div class="col-10 col-sm-6 col-md-4 col-lg-3" v-for="movie, index in filteredData" v-show="(startMovie <= index && index < endMovie && !movieTarget) || movieTarget" :key="index">
        <div
        class="movie p-0 m-1 card row justify-content-between bg-dark rounded shadow-sm text-start text-decoration-none">
        <img :src="getPosterMovieUrl(movie.poster_path)" class="card-img-top p-0" :alt="movie.original_title"
          loading="lazy">
        <div class="dec pe-0 py-4">
          <div class="row pe-0 align-items-center">
            <h5 class="col-9 text-white text-break m-0">{{ movie.title }}</h5>
            <div class="col-3 ps-0">
              <i class="fa-solid fa-star text-warning"></i>
              <small class="fs-6 text-white">{{ movie.vote_average }}</small>
            </div>
          </div>
          <div class="date pt-1 text-secondary text-uppercase fw-light">
            <i class="fa-regular fa-clock"></i>
            {{ movie.release_date }} ({{ movie.original_language }})
          </div>
        </div>
      </div>
      </div>
    </div>
    <ul class="btn-group btn-list list-unstyled my-5" role="group">
      <li class="w-0 rounded-0" v-for="btn,index in Math.ceil(numbersOfMovies / numbersOfMoviesInPage)" :key="index">
        <button type="button" class="btn btn-warning border rounded-0" @click="showMoviesInPage(((index) * numbersOfMoviesInPage), (((index) * numbersOfMoviesInPage) + numbersOfMoviesInPage))">{{index + 1}}</button>
      </li>
    </ul>
    <div class="statistics row mb-4 flex-wrap">
      <div class="col-8 col-sm-6 m-auto col-md-4 col-lg-3 my-3">
        <div class="bg-light shadow rounded p-3">
          <p class="fs-4">Titles over 7</p>
        <p class="fw-bold fs-1">{{titlesOver7}}</p>
        </div>
      </div>
      <div class="col-8 col-sm-6 m-auto col-md-4 col-lg-3 my-3">
        <div class="bg-light shadow rounded p-3">
          <p class="fs-4">Titles less than 5</p>
        <p class="fw-bold fs-1">{{titlesOver5}}</p>
        </div>
      </div>
      <div class="col-8 col-sm-6 m-auto col-md-4 col-lg-3 my-3">
        <div class="bg-light shadow rounded p-3">
          <p class="fs-4">Titles vote count</p>
        <p class="fw-bold fs-1">{{ voteCount }}</p>
        </div>
      </div>
      <div class="col-8 col-sm-6 m-auto col-md-4 col-lg-3 my-3">
        <div class="bg-light shadow rounded p-3">
          <p class="fs-4">Action titles</p>
        <p class="fw-bold fs-1">{{ movieActive }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      // Data properties
      fetchData: [],
      numbersOfMovies: 0,
      numbersOfMoviesInPage: 12,
      startMovie: 0,
      endMovie: 0,
      titlesOver7: 0.0,
      titlesOver5: 0.0,
      voteCount: 0,
      movieActive: 0,
      movieTarget: '',
      countMovieTarget: 0,
      arrayTarget: []
    }
  },
  methods: {
    // Code to fetch popular movies from the API goes here
    async getPopularMovies (page) {
      // API request to fetch popular movies
      const apiKey = '1f436c21999a1929bb2c39c7e0d71cc4'
      const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
      try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        return data.results
      } catch (error) {
        console.error('Error fetching popular movies:', error)
      }
    },
    // show or hint ul list in search
    logTargetElement (event) {
      if (!event.target.classList.contains('list-search')) {
        this.movieTarget = ''
      }
    },
    // show movies according page number
    showMoviesInPage (startMovieCount, endMovieCount = startMovieCount + 1) {
      // Set startMovie and endMovie to show movies within the specified range
      this.startMovie = startMovieCount
      this.endMovie = endMovieCount
      // Reset the search input
      // this.movieTarget = ''
      // Scroll to the top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    // get poster url path
    getPosterMovieUrl (posterUrl) {
      const basePosterPath = 'https://image.tmdb.org/t/p/w500'
      return posterUrl ? basePosterPath + posterUrl : '/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg'
    },
    // calc statistics for movies
    statistics () {
      this.titlesOver5 = 0
      this.titlesOver7 = 0
      this.voteCount = 0
      this.movieActive = 0
      if (this.movieTarget.length === 0) {
        this.fetchData.forEach((movie, index) => {
          if (this.startMovie <= index && index < this.endMovie) {
            if (movie.vote_average >= 7) {
              this.titlesOver7++
            }
          }
        })
        this.fetchData.forEach((movie, index) => {
          if (this.startMovie <= index && index < this.endMovie) {
            if (movie.vote_average > 5) {
              this.titlesOver5++
            }
          }
        })
        this.fetchData.forEach((movie, index) => {
          if (this.startMovie <= index && index < this.endMovie) {
            this.voteCount += movie.vote_count
          }
        })
      } else {
        this.filteredData.forEach((movie, index) => {
          if (movie.vote_average >= 7) {
            this.titlesOver7++
          }
          if (movie.vote_average > 5) {
            this.titlesOver5++
          }
          this.voteCount += movie.vote_count
        })
      }
      const voteCountAsString = String(this.voteCount)
      if (voteCountAsString.length <= 3) {
        this.voteCount = voteCountAsString
      } else if (voteCountAsString.length === 4) {
        this.voteCount = `${voteCountAsString.slice(0, 1)}K`
      } else if (voteCountAsString.length === 5) {
        this.voteCount = `${voteCountAsString.slice(0, 2)}K`
      } else if (voteCountAsString.length === 6) {
        this.voteCount = `${voteCountAsString.slice(0, 3)}K`
      } else if (voteCountAsString.length === 7) {
        this.voteCount = `${voteCountAsString.slice(0, 1)}M`
      } else if (voteCountAsString.length === 8) {
        this.voteCount = `${voteCountAsString.slice(0, 2)}M`
      } else if (voteCountAsString.length === 9) {
        this.voteCount = `${voteCountAsString.slice(0, 3)}M`
      }
      this.fetchData.forEach((movie, index) => {
        if (this.startMovie <= index && index < this.endMovie) {
          this.movieActive++
        }
      })
      this.movieActive = (this.movieActive * 100) / 40 + '%'
    }
  },
  computed: {
    filteredData () {
      this.statistics()
      const filtering = new RegExp(this.movieTarget, 'i')
      return this.arrayTarget.filter((el) => {
        return el.title.match(filtering)
      })
    }
  },
  watch: {
    filteredData: {
      handler () {
        this.statistics()
      },
      immediate: true // Run the handler immediately after creating the watcher
    }
  },
  async created () {
    const page1Data = await this.getPopularMovies(1)
    const page2Data = await this.getPopularMovies(2)
    this.fetchData = [...page1Data, ...page2Data]
    this.numbersOfMovies = this.fetchData.length
    this.endMovie = this.numbersOfMoviesInPage
    this.fetchData.forEach((el, index) => {
      const objMovie = {
        id: index,
        title: el.original_title,
        release_date: el.release_date,
        original_language: el.original_language,
        vote_average: el.vote_average,
        vote_count: el.vote_count,
        poster_path: this.getPosterMovieUrl(el.poster_path)
      }
      this.arrayTarget.push(objMovie)
    })
  },
  name: 'MainComponent'
}
</script>
