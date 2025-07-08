import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import { numberWithCommas } from "../CoinsTable";

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const [topCoin, setTopCoin] = useState(null);

const fetchTrendingCoins = async () => {
  const proxy = "https://thingproxy.freeboard.io/fetch/";
  const url = TrendingCoins(currency);
  try {
    const { data } = await axios.get(proxy + url);
    setTrending(data);

    // Find top performer
    const best = [...data].sort(
      (a, b) =>
        b.price_change_percentage_24h - a.price_change_percentage_24h
    )[0];
    setTopCoin(best);
  } catch (err) {
    console.error("FETCH TRENDING COINS ERROR:", err.message);
  }
};


  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const useStyles = makeStyles((theme) => ({
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
    },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
    },
  }));

  const classes = useStyles();

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      {topCoin && (
  <div
    style={{
      textAlign: "center",
      color: "gold",
      fontFamily: "Montserrat",
      marginBottom: 20,
    }}
  >
    <h2>🚀 Best Performer (24h): {topCoin.name}</h2>
    <p>
      {topCoin.symbol.toUpperCase()} ↑{" "}
      {topCoin.price_change_percentage_24h.toFixed(2)}%
    </p>
    <p>
      Price: {symbol} {numberWithCommas(topCoin.current_price.toFixed(2))}
    </p>
  </div>
)}

      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default Carousel;
