import { notFound } from 'next/navigation';
import React from 'react';
import { getSearchedMovies } from '@/lib/getMovies';
import { getPopularMovies } from '@/lib/getMovies';
import MoviesCarousel from '@/components/MoviesCarousel';
import AIsuggustions from '@/components/AIsuggustions';


type Props={
    params:{
        term:string;
    };
}
const SearchPage = async ({params:{term}}:Props) => {
  
    if(!term){
       notFound();
    }
    const termToUse=decodeURI(term);
    const movies= await getSearchedMovies(termToUse);
    const popularMovies=await getPopularMovies();
  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-5 mt-32 xl:mt-42">
        <h1 className="text-6xl font-bold px-10">Results for {termToUse}</h1>
        <AIsuggustions term={termToUse} />
        <MoviesCarousel title="Movies" movies={movies} isVertical/>
        <MoviesCarousel title="You may also like" movies={popularMovies}/>
        </div>
    </div>
  )
}

export default SearchPage