<?php

namespace App\Models\Traits;

use Ramsey\Uuid\Uuid as BaseUuid;

trait Uuid
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($obj) {
            $obj->id = BaseUuid::uuid4();
        });
    }
}
