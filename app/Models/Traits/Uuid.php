<?php


namespace App\Models\Traits;

use \Ramsey\Uuid\Uuid as RamseyRamsey;

trait Uuid
{
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($obj){
            $obj->id = RamseyRamsey::uuid4();
        });
    }
}
