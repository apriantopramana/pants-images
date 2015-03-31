/**
 * pants-images
 *
 * MIT LICENSE
 *
 * Copyright (c) 2014 PT Sagara Xinix Solusitama - Xinix Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @author     Apriyanto Pramana Putra <apriantopramanaputra@gmail.com>
 * @copyright  2015 PT Sagara Xinix Solusitama
 */

 (function(root) {
    "use strict";

    pants('pants-images', {
        value: '',
        to: '',
        prefixs: '',
        basebucket: '',
        bucket: 'uploader/images/',
        name: ''
    })
    .event('click a.select', function(){
        $(this).find('input[type="file"]').trigger('click');
    })
    .event('change input[type="file"]', function(){
        var selector = this.querySelector('input[type="file"]');
        var data = new FormData();
        var name = this.name;
        var that = this;

        $.each(selector.files, function(i, file) {
            data.append('files[]', file);
        });

        $.ajax({
            url: this.prefixs + this.to + '?' + 'base=' + this.basebucket + '&bucket=' + this.bucket,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();

                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e){
                        if (e.lengthComputable) {
                            var progress = Math.round(e.loaded / e.total * 100)

                            $(that).find('progress').attr({value:e.loaded,max:e.total});
                            $(that).find('.progress-value').html(progress + '%');
                        }
                    }, false);
                }
                return myXhr;
            },
            beforeSend: function(){
                $(that).find("progress").show();
                $(that).find(".progress-value").show();
            },
            error: function(){
                // Error Handling
            },
        }).done(function(result){
            $(that).find("progress").hide();
            $(that).find(".progress-value").hide();

            var hiddenInput = '';
            var image = '';
            $.each(JSON.parse(result), function(k, v){
                image +=  '<div class="thumb span-3">'+
                              '<input type="hidden" name="'+name+'[]'+'" value="'+v.filename+'">'+
                              '<i class="exit xn xn-close" data="'+v.path+v.filename+'"></i>'+
                              '<img width="100" src="'+v.base+'/'+v.path+v.filename+'" alt="" />'+
                          '</div>';
            });

            $(that).find('.thumbnails').html(image);
        });
    })
    .register();
})(this);
