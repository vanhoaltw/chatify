import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../Firebase/Firebase";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "50px",
    paddingBottom: "25px",
    color: "#f0f0f0",
  },
  heading: {
    fontSize: "2.2em",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: "1.6em",
  },
  channelDiv: {
    padding: "15px",
  },
  channelContent: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    padding: "20px",
    alignItems: "center",
  },
  square: {
    height: "80px",
    width: "80px",
    backgroundColor: "#8fabbd66",
    fontSize: "2rem",
  },
  rootChannel: {
    height: "calc(100vh - 185px)",
    position: "relative",
    padding: "15px",
    overflowY: "scroll",
  },
  channelText: {
    paddingTop: "10px",
    fontSize: "1.2rem",
  },
  channelCard: {
    backgroundColor: "#1e2439",
    boxShadow:
      "0px 3px 4px -1px rgb(0 0 0 / 17%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    color: "rgb(220, 221, 222)",
  },
}));

function Home() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    db.collection("channels")
      .orderBy("channelName", "asc")
      .onSnapshot((snapshot) => {
        setChannels(
          snapshot.docs.map((channel) => ({
            channelName: channel.data().channelName,
            id: channel.id,
          }))
        );
        setLoading(false);
      });
  }, []);

  const goToChannel = (id) => {
    history.push(`/channel/${id}`);
  };

  return (
    <div style={{ backgroundColor: "rgb(34 39 59)" }}>
      <Grid container className={classes.root}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography component="h1" className={classes.heading}>
            Welcome to Chatify
          </Typography>
        </Grid>
      </Grid>

      <Grid container className={classes.rootChannel}>
        {!loading && !channels.length && (
          <Typography
            component="h2"
            style={{ marginTop: 20, color: "#fff", fontSize: 20, margin: '0 auto' }}
          >
            No channel
          </Typography>
        )}
        {loading &&
          [...Array(4).keys()].map((i) => (
            <Grid item xs={6} md={3} className={classes.channelDiv} key={i}>
              <Card className={classes.channelCard}>
                <CardActionArea>
                  <CardContent className={classes.channelContent}>
                    <Skeleton
                      style={{ borderRadius: "100%" }}
                      height={80}
                      width={80}
                    />
                    <Skeleton height={60} width="100%" />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        {channels.map((channel) => (
          <Grid
            item
            xs={6}
            md={3}
            className={classes.channelDiv}
            key={channel.id}
          >
            <Card className={classes.channelCard}>
              <CardActionArea
                style={{ display: "flex" }}
                onClick={() => goToChannel(channel.id)}
              >
                <CardContent className={classes.channelContent}>
                  <Avatar
                    variant="square"
                    className={classes.square}
                    style={{ backgroundColor: "#6a9ec066" }}
                  >
                    {channel.channelName.substr(0, 1).toUpperCase()}
                  </Avatar>
                  <Typography className={classes.channelText}>
                    {channel.channelName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
