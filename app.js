const express = require('express')
const mysql = require('mysql')
const expressLayout = require('express-ejs-layouts')
const { redirect } = require('express/lib/response')
const session = require('express-session')
const res = require('express/lib/response')
var request = require("request");
var fs = require('fs');
const cors = require('cors');

//Import the library into your project
var easyinvoice = require('easyinvoice');
 
const app = express()

app.use(cors())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(expressLayout)
app.use(session({
    cookie: {maxAge: 1000*60*60*24},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(express.json({}))
app.use(express.urlencoded({
    extended: true
}))

const db = mysql.createConnection({
    host: "127.0.0.1",
    database: "db_fudoo",
    user: "root",
    password: ""
})

// var sessionConnection = mysql.createConnection(db)
// var sessionStore = new MySQLStore({db},sessionConnection)


db.connect(err => {
    if(err){
        throw err
    }else{
        db.query('SELECT * FROM menu', (err, result) => {
            let transaction_iterate
            app.get('/transaction', (req, res) => {
                if(req.session.userinfo){
                    db.query(`SELECT MAX(id_transaksi) as iterasi from transaksi`,(err, result) => {
                        for(let e of result){
                            if(e.iterasi == null){
                                transaction_iterate = 1
                            }else{
                                transaction_iterate = e.iterasi
                            }
                        }
                    })
                    db.query('SELECT * FROM menu', (err, result) => {
                    db.query('SELECT * FROM kasir',(err, result2) =>{
                        res.render('component/transaction', {
                            title: "Kelola Transaksi",
                            layout: "layouts/main",
                            result,
                            isError: "style=display:none",
                            result2
                        })
                    })
                })
                }else{
                    res.redirect('/login')
                }
            })
            app.post('/transaction', (req, res) =>{
                if(req.session.userinfo){
                db.query('SELECT * FROM menu', (err, result) => {
                db.query('SELECT * FROM kasir',(err, result2) =>{
                let totalBayar = 0
                let i = 0
                for(let e of result){
                    if(req.body.jumlahBeli[i] > e.stok){
                        res.render('component/transaction', {
                            layout: "layouts/main",
                            title: "Kelola Transaksi",
                            isError: "style=display:block"
                            ,
                            result,
                            result2
                        })
                        return false
                    }else{
                        totalBayar += e.harga * req.body.jumlahBeli[i];
                        db.query(`UPDATE menu SET stok = stok-${req.body.jumlahBeli[i]} WHERE id_menu=${e.id_menu}`)
                    }
                    i++
                }
                let k = 0;
                db.query('INSERT INTO pelanggan() VALUES ()');
                db.query(`INSERT INTO transaksi(id_pelanggan,id_kasir,no_meja,tanggal_transaksi,total_bayar) VALUES ((SELECT MAX(id_pelanggan) FROM pelanggan),${req.body.kasir},${req.body.nomeja},'${new Date().toISOString().slice(0,10)}',${totalBayar})`)
                req.body.hidden.forEach((e,i) => {
                  db.query(`SELECT MAX(id_transaksi) as iterasi from transaksi`,(err, idTransaksi) => {
                     for(let j of idTransaksi){
                         db.query(`INSERT INTO detail_transaksi(id_transaksi,id_menu,jumlah,sub_total) VALUES (${j.iterasi},${e},${req.body.jumlahBeli[i]}, ${result[k].harga * req.body.jumlahBeli[k]})`)
                         k++
                        } 
                    })
                })
                transaction_iterate++
                db.query(`SELECT * FROM transaksi`, (err, result) => {
                    db.query(`SELECT detail_transaksi.id_transaksi,detail_transaksi.sub_total, menu.id_menu, tanggal_transaksi, nama_kasir,no_meja, jenis_menu, jumlah,harga, total_bayar from transaksi JOIN detail_transaksi ON detail_transaksi.id_transaksi = transaksi.id_transaksi JOIN kasir ON transaksi.id_kasir = kasir.id_kasir JOIN menu ON menu.id_menu = detail_transaksi.id_menu WHERE transaksi.id_transaksi=${transaction_iterate}`, (err,result) =>{
                        res.render('component/transaction_success', {
                            title: "Hasil Transaksi",
                            layout: "layouts/main",
                            result,
                            forPDF: JSON.stringify(result)
                        })
                    })
                })
            })
        })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/transaction/success/:id_transaksi', (req, res) => {
                if(req.session.userinfo){
                    db.query(`SELECT detail_transaksi.id_transaksi,detail_transaksi.sub_total, menu.id_menu, tanggal_transaksi, nama_kasir,no_meja, jenis_menu, jumlah,harga, total_bayar from transaksi JOIN detail_transaksi ON detail_transaksi.id_transaksi = transaksi.id_transaksi JOIN kasir ON transaksi.id_kasir = kasir.id_kasir JOIN menu ON menu.id_menu = detail_transaksi.id_menu WHERE transaksi.id_transaksi=${req.params.id_transaksi}`, (err,result) =>{
                        res.render('component/transaction_success', {
                            title: "Hasil Transaksi",
                            layout: "layouts/main",
                            result,
                            forPDF: JSON.stringify(result)
                        })
                        console.log(`${JSON.stringify(result)}`)
                    })
                }else{
                    res.redirect('/login')
                }
            })
        })
        app.get('/inventory',(req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT * FROM menu`, (err, result) => {
                    res.render('component/inventory', {
                        title: "Kelola Gudang",
                        layout: "layouts/main",
                        result
                    });
                })
            }
        })
        app.get('/inventory/add', (req, res) => {
            if(req.session.userinfo){
                res.render('component/add', {
                    title: "Tambah menu",
                    layout: "layouts/main"
                })
            }else{
                res.redirect('/login')
            }
        })
        app.post('/inventory/add', (req, res) => {
            if(req.session.userinfo){
                db.query(`INSERT INTO menu(jenis_menu,harga,stok) VALUES ('${req.body.jenis_menu}',${req.body.harga},${req.body.stok})`,(err, result) =>{
                    if (err) throw err
                    res.redirect('/inventory')
                })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/inventory/delete/:id_menu', (req,res) => {
            if(req.session.userinfo){
                db.query(`DELETE FROM menu where id_menu='${req.params.id_menu}'`)
                res.redirect('/inventory')
            }else{
                res.redirect('/login')
            }
        })
        app.get('/inventory/edit/:id_menu', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT * FROM menu WHERE id_menu='${req.params.id_menu}'`, (err, result) => {
                    res.render('component/edit', {
                        title: "Edit menu",
                        layout: "layouts/main",
                        result
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.post('/inventory/edit', (req, res) => {
            if(req.session.userinfo){
            db.query(`UPDATE menu SET jenis_menu='${req.body.jenis_menu}',harga=${req.body.harga},stok=${req.body.stok} WHERE id_menu=${req.body.hidden}`,(err, result) =>{
                if (err) throw err
                res.redirect('/inventory')
            })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/report', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT transaksi.*, kasir.nama_kasir FROM transaksi JOIN kasir ON transaksi.id_kasir = kasir.id_kasir ORDER BY id_transaksi ASC;`, (err, result) => {
                    res.render('component/report', {
                        title: "Laporan Transaksi",
                        layout: "layouts/main",
                        result,
                        searchField: '',
                        isSearched: "style=display:none"
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.post('/report', (req,res) => {
            if(req.session.userinfo){
                //Fitur Laporan Periodik
                db.query(`SELECT * FROM transaksi NATURAL JOIN kasir WHERE tanggal_transaksi BETWEEN '${req.body.periodeAwal}' AND '${req.body.periodeAkhir}'`,(err,result)=>{
                 res.render('component/report',{
                         title: "Laporan Transaksi",
                         layout: "layouts/main",
                         result,
                         searchField: 'Ada',
                         isSearched: "style=display:none"
                     })
               
                })
 
             }else{
                 res.redirect('/login')
             }
        })
        app.get('/', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT SUM(total_bayar) AS total from transaksi`, (err, totalPendapatan) => {
                    db.query('SELECT * from transaksi', (err, dataTransaksi) =>{
                    db.query(`SELECT * from transaksi ORDER BY tanggal_transaksi DESC LIMIT 5`, (err, infoTransaksi) => {
                        db.query(`SELECT id_menu, jenis_menu, stok from menu`, (err, infomenu) => {
                            res.render('component/dashboard', {
                                title: "Dashboard",
                                layout: "layouts/main",
                                totalPendapatan,
                                infoTransaksi,
                                dataTransaksi,
                                infomenu
                            })
                            for (let e of infoTransaksi){
                                console.log(e.no_meja)
                            }
                        })
                    })
                    })
                })
            }else{
                res.redirect('/login')
            }
        })
        app.get('/login',(req,res) => {
            res.render('component/loginForm',{
                layout: "layouts/login",
                isHidden: 'hidden'
            })
        })
        app.post('/login',(req, res) => {
            db.query(`SELECT username, password FROM login_user`,(err, result) => {
                // [username, password] = ...result;
                let username = result[0].username;
                let password = result[0].password;
                if(username != req.body.username || password != req.body.password){
                    res.status(401)
                    res.render('component/loginForm',{
                        layout: "layouts/login",
                        isHidden: undefined
                    })
                }else{
                    req.session.userinfo = result[0].username
                    res.redirect('/')
                }
            })  
        })
        app.get('/logout',(req,res) =>{
            req.session.destroy(err => {
                if(!err){
                    res.redirect('/login')
                }
            })
        })

        app.get('/status', (req,res) => {
            if(req.session.userinfo){
                db.query(`SELECT transaksi.*, kasir.nama_kasir FROM transaksi JOIN kasir ON transaksi.id_kasir = kasir.id_kasir`,(err,result) =>{

                    db.query(`SELECT detail_transaksi.id_transaksi, menu.id_menu, tanggal_transaksi, nama_kasir,no_meja, jenis_menu, jumlah,harga, total_bayar from transaksi JOIN detail_transaksi ON detail_transaksi.id_transaksi = transaksi.id_transaksi JOIN kasir ON transaksi.id_kasir = kasir.id_kasir JOIN menu ON menu.id_menu = detail_transaksi.id_menu`, (err,result2) => {
  
                        res.render('component/status', {
                            layout: 'layouts/main',
                            title: "Status Pesanan",
                            result,
                            result2
                        })
                })
                })
                
            }
        })

        app.post('/status', (req,res) => {
            //Fitur Ubah Status
            if (req.session.userinfo) {
                db.query(`SELECT transaksi.*, kasir.nama_kasir FROM transaksi JOIN kasir ON transaksi.id_kasir = kasir.id_kasir`, (err, result) => {
                  if ((req.body.status = "selesai")) {
                    db.query(`UPDATE transaksi SET status= "selesai" WHERE id_transaksi ='${req.body.transaksi}'`, (err, result2) => {
                      res.redirect("/status")
                    })
                  }
                })
              }
        })
        app.get('/waiters', (req,res) => {
            if(req.session.userinfo){
                db.query('SELECT transaksi.* , kasir.nama_kasir FROM transaksi NATURAL JOIN kasir WHERE status="Selesai"',(err,result)=>{
                    res.render('component/waiter', {
                        layout: 'layouts/main',
                        title: "Pesanan Telah Siap",
                        searchField: '',
                        isSearched: "style=display:none",
                        result
                    })
                })
            }
        })
        app.post('/waiters', (req,res) => {
            //Fitur Ubah Status Diantar
            if (req.session.userinfo) {
                      db.query(`UPDATE transaksi SET status= "Sudah diantar" WHERE id_transaksi ='${req.body.transaksi}'`, (err, result2) => {
                        res.redirect("/waiters")
                        console.log('yo: ' +req.body.transaksi)
                      })
            }
        })
    }
    // app.get('/login', (req,res) =>{
    // })
})
app.listen(3001,() => {
    console.log('Aplikasi Restoran Berjalan Pada http://localhost:3001')
})