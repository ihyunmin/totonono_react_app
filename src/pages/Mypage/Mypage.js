import React from 'react';
import {Route, Link} from 'react-router-dom';
import './Mypage.css'
import 'react-bootstrap/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Navbar from '../../components/Navbar'
import {Tabs,Tab,Col,Row,Nav,NavItem} from 'react-bootstrap';
import { useEffect } from 'react';
import axios from 'axios';
import { selectToken, selectUser_id, selectCoin, selectBetting, selectName, selectPrincipal } from '../../redux/user/selector';
import { useDispatch, useSelector } from 'react-redux';
import { Logout, SetCoin, SetPrincipal } from '../../redux/user/action';

const useStyles = makeStyles({
    root: {
        minHeight: 200,
        maxWidth: 275,
        marginTop: 50,
        marginLeft: 50
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 18,
    },
    pos: {
      marginBottom: 5,
      marginTop: 5,
      padding: 0
    },
    body2: {

    }
  });

const useStyles1 = makeStyles({
    root: {
        maxWidth: 275,
        minHeight: 470,
        marginTop: 30,
        marginLeft: 0
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 18,
    },
    pos: {
      marginBottom: 5,
      marginTop: 5,
      padding: 0
    },
});
const useStyles2 = makeStyles({
    root: {
        maxWidth: 1500,
        padding: 0,
        marginTop: 50,
        marginRight: 50,
        backgroundColor: 'white'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 18,
    },
    pos: {
      marginBottom: 5,
      marginTop: 5,
      padding: 0
    },
    body2: {

    }
});

const matchStyles = makeStyles({
    root: {
        minWidth: 100,
        maxWidth: 800,
        marginRight: 50,
        marginLeft: 50,
        marginTop: 50,
        maxHeight: 700,
        overflowY: "auto",
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        }


    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const Mypage = (props) => {
    const classes = useStyles();
    const classes1 = useStyles1();
    const classes2 = useStyles2();
    const matchclasses = matchStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const dispatch = useDispatch();
    const token = useSelector(state => {
        return selectToken(state);
    });
    const user_id = useSelector(state => {
        return selectUser_id(state);
    });
    const user_name = useSelector(state => {
        return selectName(state);
    });
    const user_coin = useSelector(state => {
        return selectCoin(state);
    });
    const user_betting = useSelector(state => {
        return selectBetting(state);
    });
    console.log(user_betting);
    const user_principal = useSelector(state => {
        return selectPrincipal(state);
    });
    useEffect(() => {

        axios.get('http://192.249.18.232:8080/user/check', {
            headers: {
              'x-access-token': token
            }
        })
            .then((res) => {
                console.log(res.data.message);
                if(res.data.message == "error") props.history.push('/')
            })
    }, []);

    const loadList = () => {
        return user_betting.map((item) => {
            let match_date = item.betting_date.split('T')[0];
            let pred;
            if (item.prediction == "WIN") pred = "Home"
            else pred = "Away"
            return(
                <div className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-start">
                        <small>{match_date}</small>
                    </div>
                    <p className="mb-1">배팅: {pred}</p>
                    <small>배팅 코인: {item.amount}</small>
                </div>
            )
        })
    }

    const addCoin = async () =>{
        //post 보내기 (addcoin 달라고)
        const response = await axios.post('http://192.249.18.232:8080/user/addcoin',{
            user_id:user_id
        })
        console.log("adcoin 후 response :",response);

        let coin_add = user_coin + 10000;
        let principal_add = user_principal +10000;

        //성공 했다면, coin 과 principal redux 수정
        if(response.data.message == "success"){
            dispatch(SetCoin({coin:coin_add}));
            dispatch(SetPrincipal({principal:principal_add}));
        }

    }

    const deleteUser = async () =>{
        //post 보내기 (addcoin 달라고)
        const response = await axios.post('http://192.249.18.232:8080/user/deleteUser',{
            user_id:user_id
        })
        console.log("delete 후 response :",response);
        
        //delete 하고 나면, 
        dispatch(Logout({token:'init'}));
        props.history.push('/');
    }

    return(
        <div>
            <Navbar/>
            <div className="row">
                <Card className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            회원 정보
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {user_name}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            보유 코인: {user_coin}coin
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={addCoin}>코인 1만 개 충전</Button>
                        <Button size="small" onClick={deleteUser}>회원탈퇴</Button>
                    </CardActions>
                </Card>
                
                {/* <Card className={classes2.root}>
                <CardContent>
                    <Typography className={classes2.title} color="textSecondary" gutterBottom>
                        불법 토토 예비 희생양
                    </Typography>
                    <Typography variant="h5" component="h2">
                        이현민
                    </Typography>
                    <Typography className={classes2.pos} color="textSecondary">
                        보유 코인: 500 Coin
                    </Typography>
                    <Typography variant="body2" component="p">
                        3. 300만원
                    <br />
                        {'"위험해"'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">~!!~</Button>
                </CardActions>
                </Card> */}
                <div className={matchclasses.root}>
                    <Tabs defaultActiveKey="gallery1" className="dormtab">
                        <Tab eventKey="gallery1" title="현재 배팅 현황">
                            <div className="tab-item-wrapper">
                                {loadList()}
                            </div>
                        </Tab>
                        <Tab eventKey="gallery2" title="과거 기록">
                            <div className="tab-item-wrapper">
                                과거 배팅 기록들..
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <Card className={classes1.root}>
                    <CardContent>
                        <Typography className={classes1.title} color="textSecondary" gutterBottom>
                            광고
                        </Typography>
                        <Typography variant="h5" component="h2">
                            ToToNoNo
                        </Typography>
                        <Typography className={classes1.pos} color="textSecondary">
                            중학생한테
                        </Typography>
                        <Typography variant="body2" component="p">
                            털렸쥬?
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
export default Mypage;