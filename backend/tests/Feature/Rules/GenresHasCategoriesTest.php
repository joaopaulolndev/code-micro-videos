<?php

namespace Tests\Feature\Rules;

use App\Models\Category;
use App\Models\Genre;
use App\Rules\GenresHasCategoriesRule;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Collection;
use Tests\TestCase;

class GenresHasCategoriesTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * @var Collection
     */
    private $categories;

    /**
     * @var Collection
     */
    private $genres;

    protected function setUp(): void
    {
        parent::setUp();

        $this->categories = factory(Category::class, 4)->create();
        $this->genres = factory(Genre::class, 2)->create();

        $this->genres->get(0)->categories()->sync([
            $this->categories->get(0)->id,
            $this->categories->get(1)->id,
        ]);

        $this->genres->get(1)->categories()->sync([
            $this->categories->get(2)->id,
        ]);
    }

    public function testPassesIsValid()
    {
        $rule = new GenresHasCategoriesRule([
            $this->categories->get(2)->id,
        ]);
        $isValid = $rule->passes('', [
            $this->genres->get(1)->id,
        ]);
        $this->assertTrue($isValid);

        $rule = new GenresHasCategoriesRule([
            $this->categories->get(0)->id,
            $this->categories->get(2)->id,
        ]);
        $isValid = $rule->passes('', [
            $this->genres->get(0)->id,
            $this->genres->get(1)->id,
        ]);
        $this->assertTrue($isValid);

        $rule = new GenresHasCategoriesRule([
            $this->categories->get(0)->id,
            $this->categories->get(1)->id,
            $this->categories->get(2)->id,
        ]);
        $isValid = $rule->passes('', [
            $this->genres->get(0)->id,
            $this->genres->get(1)->id,
        ]);
        $this->assertTrue($isValid);
    }

    public function testPassesIsNotValid()
    {
        $rule = new GenresHasCategoriesRule([
            $this->categories->get(0)->id,
        ]);
        $isValid = $rule->passes('', [
            $this->genres->get(0)->id,
            $this->genres->get(1)->id,
        ]);
        $this->assertFalse($isValid);

        $rule = new GenresHasCategoriesRule([
            $this->categories->get(3)->id,
        ]);
        $isValid = $rule->passes('', [
            $this->genres->get(0)->id,
        ]);
        $this->assertFalse($isValid);
    }
}
