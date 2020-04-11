<?php

namespace App\ModelFilters;

use App\Models\CastMember;

class CastMemberFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'type', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%{$search}%");
    }

    public function type($type)
    {
        if (in_array((int) $type, CastMember::$types)) {
            $this->orWhere('type', (int) $type);
        }
    }
}
