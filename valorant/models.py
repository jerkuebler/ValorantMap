from django.db import models
from modelcluster.fields import ParentalKey

from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.images.edit_handlers import ImageChooserPanel


class MapsPage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full"),
        InlinePanel('map_icons', label="Map Icons")
    ]

    parent_page_types = ['home.HomePage']

    def get_context(self, request, **kwargs):
        context = super(MapsPage, self).get_context(request)
        context['agents'] = AgentPage.objects.live()
        return context


class MapPage(Page):
    description = RichTextField(blank=True)

    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full"),
        ImageChooserPanel('photo')
    ]

    parent_page_types = ['MapsPage']


class MapIcon(Orderable):
    page = ParentalKey(MapsPage, on_delete=models.CASCADE, related_name='map_icons')
    image = models.ForeignKey(
        'wagtailimages.Image', on_delete=models.CASCADE, related_name='+'
    )

    panels = [
        ImageChooserPanel('image'),
    ]


class WeaponsPage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full")
    ]

    parent_page_types = ['home.HomePage']


class WeaponPage(Page):
    description = RichTextField(blank=True)

    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    weapon_type = RichTextField(blank=True)
    cost = RichTextField(blank=True)
    magazine = RichTextField(blank=True)
    wall_pen = RichTextField(blank=True)
    prim_fire_mode = RichTextField(blank=True)
    prim_fire_rate = RichTextField(blank=True)
    sec_fire_mode = RichTextField(blank=True)
    sec_fire_rate = RichTextField(blank=True)
    dam_short_body = RichTextField(blank=True)
    dam_short_head = RichTextField(blank=True)
    dam_short_leg = RichTextField(blank=True)
    dam_long_body = RichTextField(blank=True)
    dam_long_head = RichTextField(blank=True)
    dam_long_leg = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full"),
        ImageChooserPanel('photo'),
        FieldPanel('weapon_type', classname="full"),
        FieldPanel('cost', classname="full"),
        FieldPanel('magazine', classname="full"),
        FieldPanel('wall_pen', classname="full"),
        FieldPanel('prim_fire_mode', classname="full"),
        FieldPanel('prim_fire_rate', classname="full"),
        FieldPanel('sec_fire_mode', classname="full"),
        FieldPanel('sec_fire_rate', classname="full"),
        FieldPanel('dam_short_body', classname="full"),
        FieldPanel('dam_short_head', classname="full"),
        FieldPanel('dam_short_leg', classname="full"),
        FieldPanel('dam_long_body', classname="full"),
        FieldPanel('dam_long_head', classname="full"),
        FieldPanel('dam_long_leg', classname="full"),
        InlinePanel('weapon_images', label="Weapon Images")
    ]

    parent_page_types = ['WeaponsPage']


class WeaponGalleryImage(Orderable):
    page = ParentalKey(WeaponPage, on_delete=models.CASCADE, related_name='weapon_images')
    image = models.ForeignKey(
        'wagtailimages.Image', on_delete=models.CASCADE, related_name='+'
    )
    caption = models.CharField(blank=True, max_length=250)
    source = models.CharField(blank=True, max_length=250)

    panels = [
        ImageChooserPanel('image'),
        FieldPanel('caption'),
        FieldPanel('source')
    ]


class AgentsPage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full")
    ]

    parent_page_types = ['home.HomePage']


class AgentPage(Page):
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    icon = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    description = RichTextField(blank=True)

    char_type = RichTextField(blank=True)
    char_type_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    origin = RichTextField(blank=True)
    origin_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    gunbuddy_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    gun_type = RichTextField(blank=True)
    gun_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    ability_a = RichTextField(blank=True)
    ability_a_cost = RichTextField(blank=True)
    ability_a_desc = RichTextField(blank=True)
    ability_a_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    ability_b = RichTextField(blank=True)
    ability_b_cost = RichTextField(blank=True)
    ability_b_desc = RichTextField(blank=True)
    ability_b_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    ability_sig = RichTextField(blank=True)
    ability_sig_cost = RichTextField(blank=True)
    ability_sig_desc = RichTextField(blank=True)
    ability_sig_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    ability_ult = RichTextField(blank=True)
    ability_ult_cost = RichTextField(blank=True)
    ability_ult_desc = RichTextField(blank=True)
    ability_ult_img = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full"),
        ImageChooserPanel('photo'),
        ImageChooserPanel('icon'),
        FieldPanel('char_type', classname="full"),
        ImageChooserPanel('char_type_img', classname="full"),
        FieldPanel('origin', classname="full"),
        ImageChooserPanel('origin_img', classname="full"),
        ImageChooserPanel('gunbuddy_img'),
        FieldPanel('gun_type'),
        ImageChooserPanel('gun_img'),
        FieldPanel('ability_a', classname="full"),
        FieldPanel('ability_a_cost', classname="full"),
        ImageChooserPanel('ability_a_img'),
        FieldPanel('ability_a_desc', classname="full"),
        FieldPanel('ability_b', classname="full"),
        FieldPanel('ability_b_cost', classname="full"),
        ImageChooserPanel('ability_b_img'),
        FieldPanel('ability_b_desc', classname="full"),
        FieldPanel('ability_sig', classname="full"),
        FieldPanel('ability_sig_cost', classname="full"),
        ImageChooserPanel('ability_sig_img'),
        FieldPanel('ability_sig_desc', classname="full"),
        FieldPanel('ability_ult', classname="full"),
        FieldPanel('ability_ult_cost', classname="full"),
        ImageChooserPanel('ability_ult_img'),
        FieldPanel('ability_ult_desc', classname="full"),
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ]

    parent_page_types = ['AgentsPage']
    subpage_types = []
