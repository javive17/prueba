<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        try {
            $dbname = DB::connection('sqlsrv')->getDatabaseName();
            echo "Connected database name is: {$dbname}";
        } catch(\Exception $e) {
            echo "Error in connecting to the database";
        }
        echo '<br>';

        $dog = DB::connection('sqlsrv')->table('VW_ESCANEO_TICKET_TODOS_PROYES')->limit(10)->get();
        dd($dog);

        // return view('home');
    }
}
