<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class CategoryFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%{$search}%");
    }

    public function isActive($isActive)
    {
        $this->where('is_active', '=', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
    }

    public function sortByUpdatedAt()
    {
        $dir = strtolower($this->input('dir') === 'asc' ? 'ASC' : 'DESC');
        $this->orderBy('updated_at', $dir);
    }

    public function genres($genres)
    {
        $ids = explode(',', $genres);

        $this->whereHas('genres', function (Builder $query) use ($ids) {
            $query->whereIn('id', $ids);
        });
    }
}
