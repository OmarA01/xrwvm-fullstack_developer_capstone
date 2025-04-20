import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);
  const [loadingDealer, setLoadingDealer] = useState(true);

  const { id } = useParams();

  const root_url = window.location.origin + "/";
  const dealer_url = root_url + `djangoapp/dealer/${id}`;
  const reviews_url = root_url + `djangoapp/reviews/dealer/${id}`;
  const post_review_url = root_url + `postreview/${id}`;

 const get_dealer = async () => {
  try {
    console.log("Fetching from dealer_url:", dealer_url);
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();
    console.log("Dealer response:", retobj);
    if (retobj.status === 200) {
      setDealer(retobj.dealer);
    } else {
      console.warn("Non-200 response for dealer:", retobj);
    }
  } catch (error) {
    console.error("Failed to fetch dealer:", error);
  } finally {
    setLoadingDealer(false);
  }
};


  const get_reviews = async () => {
    try {
      console.log("Fetching from reviews_url:", reviews_url);
      const res = await fetch(reviews_url, { method: "GET" });
      const retobj = await res.json();
      console.log("Reviews response:", retobj);
      if (retobj.status === 200) {
        if (retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      } else {
        console.warn("Non-200 response for reviews:", retobj);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon :
           sentiment === "negative" ? negative_icon :
           neutral_icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review_url}>
          <img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' />
        </a>
      );
    }
  }, []);

  if (loadingDealer || !dealer) {
    return (
      <div style={{ margin: "20px" }}>
        <Header />
        <h2>Loading Dealer Info...</h2>
      </div>
    );
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>{dealer.full_name}{postReview}</h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <p>Loading Reviews....</p>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div className='review_panel' key={index}>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
